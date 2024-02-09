
export default function RatingSystem(){
  const url = "https://api.mendable.ai/v1/rateMessage";
  
  const data = {
    api_key: process.env.MENDABLE_API_KEY,
    message_id: 123,
    rating_value: 1
  };
  
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}