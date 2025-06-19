const axios = require('axios');

async function callCodegenAPI({ filePath, task, coverageThreshold }) {
  try {
    const res = await axios.post('http://localhost:3535/api/codegen', {
      filePath,
      task,
      coverageThreshold,
    });
    return res.data;
  } catch (err) {
    console.error('❌ Error calling codegen service:', err.message);
    return null;
  }
}

module.exports = { callCodegenAPI };
