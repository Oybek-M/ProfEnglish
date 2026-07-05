const express = require('express');
const { requireAuth } = require('../auth/auth');
const { getOrGenerateLesson } = require('../ai/lessonService');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
  const { profession, level, goal } = req.user;
  if (!profession || !level || !goal) {
    return res.status(400).json({ error: 'ONBOARDING_INCOMPLETE' });
  }
  try {
    const lesson = await getOrGenerateLesson(profession, level, goal);
    res.json({ lesson });
  } catch (err) {
    res.status(502).json({ error: 'LESSON_GENERATION_FAILED', detail: err.message });
  }
});

module.exports = router;
