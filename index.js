// index.js
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');

const prompt = fs.readFileSync('./prompts/parent.txt', 'utf8');

async function askChatGPT() {
  try {
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(chalk.green('\n🧠 ChatGPT says:\n'));
    console.log(res.data.choices[0].message.content);
  } catch (error) {
    console.error(chalk.red('❌ Error calling API:', error.response?.data || error.message));
  }
}

askChatGPT();
