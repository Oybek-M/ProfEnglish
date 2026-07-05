require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5001,
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  openRouterModel: 'openai/gpt-4o-mini',
};
