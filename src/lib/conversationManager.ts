export function createConversationManager() {
    let conversationId: number | null = null;

    async function getConversationId() {
        try {
            // Check if a conversation ID needs to be created
            if (conversationId === null) {
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
                conversationId = responseData.conversation_id;
            }

            return conversationId;
        } catch (error) {
            console.error("Error in getConversationId:", error);
            throw error; // Rethrow the error to handle it at a higher level
        }
    }

    return {
        getConversationId,
    };
}