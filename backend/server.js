const express = require('express');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const lessonRoutes = require('./routes/lessonRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/lesson', lessonRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(config.port, () => {
  console.log(`ProfEnglish backend ${config.port}-portda ishga tushdi`);
  console.log('Auth routes mounted successfully');
});
