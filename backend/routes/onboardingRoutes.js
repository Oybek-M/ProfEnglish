const express = require('express');
const { requireAuth, updateUser, publicUser } = require('../auth/auth');
const { publicQuestions, calculateLevel } = require('../content/levelTestQuestions');

const router = express.Router();

router.get('/level-test', (req, res) => {
  res.json({ questions: publicQuestions() });
});

router.post('/complete', requireAuth, (req, res) => {
  const { profession, answerIndexes, goal } = req.body;
  if (!['it', 'business'].includes(profession)) {
    return res.status(400).json({ error: 'INVALID_PROFESSION' });
  }
  if (!Array.isArray(answerIndexes) || answerIndexes.length !== 10) {
    return res.status(400).json({ error: 'INVALID_ANSWERS' });
  }
  if (!goal) {
    return res.status(400).json({ error: 'INVALID_GOAL' });
  }
  const { level, score } = calculateLevel(answerIndexes);
  const user = updateUser(req.user.id, { profession, level, goal });
  res.json({ user: publicUser(user), levelTestScore: score });
});

module.exports = router;
