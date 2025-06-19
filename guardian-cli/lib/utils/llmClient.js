const { ollama } = require('./clients/ollamaClient'); // or however you're calling it

async function runLLM(prompt) {
  const response = await ollama.chat({
    model: 'dolphin3:8b', // or your configured model
    messages: [{ role: 'user', content: prompt }],
  });

  return response;
}

module.exports = { runLLM };
