import { AIStream, AIStreamCallbacks } from "ai";

export interface MendableStreamCallbacks extends AIStreamCallbacks {
  onMessage?: (data: string) => Promise<void>;
}


function parseMendableStream(): (data: string) => string | void {
  return (data) => {
    const parsedData = JSON.parse(data);
    const chunk = parsedData.chunk;
    

    // TODO: handle source and message_id to provide sources to the users
    // More info here: https://docs.mendable.ai/mendable-api/chat
    if (chunk === "<|source|>" || chunk === "<|message_id|>"){
      if ( chunk === "<|message_id|>" ){
        message_id = parsedData.metadata
        console.log(message_id)
      }
      else if (chunk === "<|source|>"){
        const source = parsedData.metadata[0].link
        return source
      }
      return
    }

    if (chunk === "<|tool_called|>") return `<|tool_called|>$$${parsedData.metadata.name}$$${parsedData.metadata.is_action}$$`

    if (chunk) return chunk;
  };
}

export async function MendableStream(
  data: any,
  callbacks?: MendableStreamCallbacks
) {
  const url = "https://api.mendable.ai/v1/mendableChat";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Response error: " + (await response.text()));
  }

  return AIStream(response, parseMendableStream(), callbacks);
}

export async function ratingSystem(rating: number) {
  const rateUrl = "https://api.mendable.ai/v1/rateMessage";

  console.log(message_id)

  if (message_id !== null) {
      try {
          const RateData = {
              api_key: process.env.MENDABLE_API_KEY,
              message_id: message_id,
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
