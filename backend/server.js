const express = require('express');
const path = require('path');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const chatRoutes = require('./routes/chatRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/lesson', lessonRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/evaluation', evaluationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.use((req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(config.port, () => {
  console.log(`ProfEnglish backend ${config.port}-portda ishga tushdi`);
});
