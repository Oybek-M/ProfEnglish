const express = require('express');
const { registerUser, loginUser, signToken, publicUser } = require('../auth/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ error: 'INVALID_INPUT' });
  }
  try {
    const user = await registerUser(email, password);
    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    if (err.message === 'EMAIL_TAKEN') {
      return res.status(409).json({ error: 'EMAIL_TAKEN' });
    }
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  }
});

module.exports = router;
