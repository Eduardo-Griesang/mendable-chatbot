import { Configuration, OpenAIApi } from "openai-edge";
import { StreamingTextResponse } from "ai";
import { MendableStream } from "@/lib/mendable_stream";
import { welcomeMessage } from "@/lib/strings";

export const runtime = "edge";

var conversation_id: number | null = null;

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

export async function POST(req: Request) {
  const { messages } = await req.json();
  const conversationId = await getConversationId();

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
