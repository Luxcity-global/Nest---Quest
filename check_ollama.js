
async function checkOllama() {
    try {
        const response = await fetch('http://127.0.0.1:11434/api/tags');
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Failed to connect to Ollama:", err.message);
    }
}
checkOllama();
