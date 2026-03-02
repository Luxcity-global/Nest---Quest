
import fs from 'fs';

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
                    { role: "user", content: "Hello" }
                ]
            }),
        });

        const data = await response.json();
        fs.writeFileSync('error_debug.txt', JSON.stringify(data, null, 2), 'utf8');
        console.log("Done");
    } catch (error) {
        fs.writeFileSync('error_debug.txt', error.stack, 'utf8');
        console.log("Failed");
    }
}

test();
