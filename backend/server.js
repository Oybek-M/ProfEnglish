const express = require('express');
const config = require('./config');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(config.port, () => {
  console.log(`ProfEnglish backend ${config.port}-portda ishga tushdi`);
});
