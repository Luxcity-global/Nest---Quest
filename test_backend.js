
const BACKEND_URL = "http://127.0.0.1:8000/api/v1/chat";

async function test() {
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    { role: "user", content: "Hello, Nestor!" }
                ],
                temperature: 0.6,
                max_tokens: 100
            }),
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Error Detail:", data.detail);
        if (data.error) console.log("Error Message:", data.error);
    } catch (error) {
        console.error("Test failed:", error);
    }
}

test();
