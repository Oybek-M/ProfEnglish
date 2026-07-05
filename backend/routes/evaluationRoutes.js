const express = require('express');
const { requireAuth } = require('../auth/auth');
const { readJson, writeJson } = require('../data/store');
const { evaluateFinalAnswer } = require('../ai/evaluationService');

const router = express.Router();

router.post('/submit', requireAuth, async (req, res) => {
  const { cacheKey, finalAnswer } = req.body;
  if (!cacheKey || !finalAnswer) {
    return res.status(400).json({ error: 'INVALID_INPUT' });
  }
  const lessonCache = readJson('lessons-cache.json', {});
  const entry = lessonCache[cacheKey];
  if (!entry) return res.status(404).json({ error: 'LESSON_NOT_FOUND' });

  try {
    const evaluation = await evaluateFinalAnswer(entry.lesson, req.user.level, finalAnswer);

    const progress = readJson('progress.json', []);
    progress.push({
      userId: req.user.id,
      lessonKey: cacheKey,
      finalAnswer,
      evaluation,
      completedAt: new Date().toISOString(),
    });
    writeJson('progress.json', progress);

    res.json({ evaluation });
  } catch (err) {
    res.status(502).json({ error: 'EVALUATION_FAILED', detail: err.message });
  }
});

router.get('/my-progress', requireAuth, (req, res) => {
  const progress = readJson('progress.json', []);
  const mine = progress.filter((p) => p.userId === req.user.id);
  res.json({ progress: mine });
});

module.exports = router;
