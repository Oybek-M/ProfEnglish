const config = require('../config');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function callOpenRouter({ messages, jsonMode = false, maxTokens = 2000, temperature = 0.7 }) {
  const body = {
    model: config.openRouterModel,
    messages,
    max_tokens: maxTokens,
    temperature,
  };
  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openRouterApiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OPENROUTER_ERROR_${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

module.exports = { callOpenRouter };
