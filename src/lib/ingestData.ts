export async function IngestData() {
    const ingestUrl = 'https://api.mendable.ai/v1/ingestData'

    const ingestData = {
        type: 'url',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript',
        api_key: process.env.MENDABLE_API_KEY
    }

    fetch(ingestUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingestData),
    })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error))
}