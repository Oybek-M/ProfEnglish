const express = require('express');
const { requireAuth } = require('../auth/auth');
const { readJson } = require('../data/store');
const { getRoleplayReply } = require('../ai/chatService');

const router = express.Router();

router.post('/message', requireAuth, async (req, res) => {
  const { cacheKey, history, message } = req.body;
  if (!cacheKey || !message) {
    return res.status(400).json({ error: 'INVALID_INPUT' });
  }
  const cache = readJson('lessons-cache.json', {});
  const entry = cache[cacheKey];
  if (!entry) return res.status(404).json({ error: 'LESSON_NOT_FOUND' });

  try {
    const reply = await getRoleplayReply(entry.lesson, req.user.level, history || [], message);
    res.json({ reply });
  } catch (err) {
    res.status(502).json({ error: 'CHAT_FAILED', detail: err.message });
  }
});

module.exports = router;
