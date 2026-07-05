const express = require('express');
const { registerUser, loginUser, signToken, publicUser, requireAuth, updateUser } = require('../auth/auth');

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

router.patch('/profile', requireAuth, (req, res) => {
  const { firstName, lastName, gender, birthDate } = req.body;
  const updateObject = {};

  // Validate and add firstName if provided
  if (firstName !== undefined && firstName !== null) {
    const trimmed = String(firstName).trim();
    if (trimmed === '' || trimmed.length > 50) {
      return res.status(400).json({ error: 'INVALID_INPUT' });
    }
    updateObject.firstName = trimmed;
  }

  // Validate and add lastName if provided
  if (lastName !== undefined && lastName !== null) {
    const trimmed = String(lastName).trim();
    if (trimmed === '' || trimmed.length > 50) {
      return res.status(400).json({ error: 'INVALID_INPUT' });
    }
    updateObject.lastName = trimmed;
  }

  // Validate and add gender if provided
  if (gender !== undefined && gender !== null) {
    if (!['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({ error: 'INVALID_GENDER' });
    }
    updateObject.gender = gender;
  }

  // Validate and add birthDate if provided
  if (birthDate !== undefined && birthDate !== null) {
    const parsed = new Date(birthDate);
    if (isNaN(parsed.getTime())) {
      return res.status(400).json({ error: 'INVALID_BIRTHDATE' });
    }
    // Check that date is in the past
    if (parsed > new Date()) {
      return res.status(400).json({ error: 'INVALID_BIRTHDATE' });
    }
    // Check age is between 10 and 100
    const now = new Date();
    let age = now.getFullYear() - parsed.getFullYear();
    const monthDiff = now.getMonth() - parsed.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < parsed.getDate())) {
      age--;
    }
    if (age < 10 || age > 100) {
      return res.status(400).json({ error: 'INVALID_BIRTHDATE' });
    }
    updateObject.birthDate = birthDate;
  }

  try {
    const user = updateUser(req.user.id, updateObject);
    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

module.exports = router;
