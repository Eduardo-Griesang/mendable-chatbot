import { Configuration, OpenAIApi } from "openai-edge";
import { StreamingTextResponse } from "ai";
import { MendableStream } from "@/lib/mendable_stream";
import { welcomeMessage } from "@/lib/strings";
import { createConversationManager } from "@/lib/conversationManager";

export const runtime = "edge";

let conversation_id: number | null = null;

export async function getConversationId() {
  try {
      // Check if a conversation ID needs to be created
      if (conversation_id === null) {
          const url = "https://api.mendable.ai/v1/newConversation";
          const data = {
              api_key: process.env.MENDABLE_API_KEY,
          };

          const response = await fetch(url, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
          });

          if (!response.ok) {
              console.error(`Error creating conversation: ${response.statusText}`);
              throw new Error(`Failed to create conversation. Status: ${response.status}`);
          }

          // Set the conversation ID if it doesn't exist
          const responseData = await response.json();
          conversation_id = responseData.conversation_id;
      }

      return conversation_id;
  } catch (error) {
      console.error("Error in getConversationId:", error);
      throw error; // Rethrow the error to handle it at a higher level
  }
}

const conversationManager = createConversationManager();

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
  const conversationId = await conversationManager.getConversationId();
  console.log(conversationId)

  // question is on the last message
  const question = messages[messages.length - 1].content;
  messages.pop();

  const history = [];
  for (let i = 0; i < messages.length; i += 2) {
    history.push({
      prompt: messages[i].content,
      response: messages[i + 1].content,
    });
  }

  history.unshift({
    prompt: "",
    response: welcomeMessage,
  });

  const stream = await MendableStream({
    api_key: process.env.MENDABLE_API_KEY,
    question: question,
    history: history,
    conversation_id: conversationId,
  });

  return new StreamingTextResponse(stream);
}

export async function ratingSystem(rating: number) {
  const rateUrl = "https://api.mendable.ai/v1/rateMessage";
  const messageUrl = "https://api.mendable.ai/v1/messages/byConversationId";

  const conversationId = await conversationManager.returnConversationId();
  console.log(conversationId);

  if (conversationId !== null) {
      console.log(conversationId);

      const MessageData = {
          api_key: process.env.MENDABLE_API_KEY,
          conversation_id: conversationId,
      };

      try {
          const messageResponse = await fetch(messageUrl, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(MessageData),
          });

          if (!messageResponse.ok) {
              console.error(`Error fetching messages: ${messageResponse.statusText}`);
              throw new Error(`Failed to fetch messages. Status: ${messageResponse.status}`);
          }

          const messageData = await messageResponse.json();
          console.log(messageData);

          const RateData = {
              api_key: process.env.MENDABLE_API_KEY,
              message_id: messageData[0].message_id,
              rating_value: rating,
          };

          const rateResponse = await fetch(rateUrl, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(RateData),
          });

          if (!rateResponse.ok) {
              console.error(`Error rating message: ${rateResponse.statusText}`);
              throw new Error(`Failed to rate message. Status: ${rateResponse.status}`);
          }

          const rateData = await rateResponse.json();
          console.log(rateData);
      } catch (error) {
          console.error("Error in ratingSystem:", error);
      }
  } else {
      console.error("Conversation ID is null.");
  }
}
