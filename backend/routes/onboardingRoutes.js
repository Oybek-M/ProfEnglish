const express = require('express');
const { requireAuth, updateUser, publicUser } = require('../auth/auth');
const { publicQuestions, calculateLevel } = require('../content/levelTestQuestions');

const VALID_PROFESSIONS = ['it', 'business'];
const VALID_GOALS = ['job', 'clients', 'ielts', 'career'];
const VALID_TARGET_LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

const router = express.Router();

router.get('/level-test', (req, res) => {
  res.json({ questions: publicQuestions() });
});

router.post('/complete', requireAuth, (req, res) => {
  const { profession, answerIndexes, goal, targetLevel } = req.body;
  if (!VALID_PROFESSIONS.includes(profession)) {
    return res.status(400).json({ error: 'INVALID_PROFESSION' });
  }
  if (!Array.isArray(answerIndexes) || answerIndexes.length !== 10) {
    return res.status(400).json({ error: 'INVALID_ANSWERS' });
  }
  if (!answerIndexes.every((idx) => Number.isInteger(idx) && idx >= 0 && idx < 4)) {
    return res.status(400).json({ error: 'INVALID_ANSWERS' });
  }
  if (!VALID_GOALS.includes(goal)) {
    return res.status(400).json({ error: 'INVALID_GOAL' });
  }
  if (!targetLevel || !VALID_TARGET_LEVELS.includes(targetLevel)) {
    return res.status(400).json({ error: 'INVALID_TARGET_LEVEL' });
  }
  const { level, score } = calculateLevel(answerIndexes);
  const user = updateUser(req.user.id, { profession, level, goal, targetLevel });
  res.json({ user: publicUser(user), levelTestScore: score });
});

module.exports = router;
