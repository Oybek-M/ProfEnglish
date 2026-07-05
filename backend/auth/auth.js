const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readJson, writeJson } = require('../data/store');
const config = require('../config');

const USERS_FILE = 'users.json';

function getUsers() {
  return readJson(USERS_FILE, []);
}

function saveUsers(users) {
  writeJson(USERS_FILE, users);
}

async function registerUser(email, password) {
  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error('EMAIL_TAKEN');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    email,
    passwordHash,
    profession: null,
    level: null,
    goal: null,
    firstName: null,
    lastName: null,
    gender: null,
    birthDate: null,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return user;
}

async function loginUser(email, password) {
  const users = getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error('INVALID_CREDENTIALS');
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('INVALID_CREDENTIALS');
  return user;
}

function updateUser(userId, updates) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error('USER_NOT_FOUND');
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  return users[idx];
}

function getUserById(userId) {
  const users = getUsers();
  return users.find((u) => u.id === userId);
}

function signToken(user) {
  return jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' });
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'NO_TOKEN' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = getUserById(payload.userId);
    if (!user) return res.status(401).json({ error: 'USER_NOT_FOUND' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'INVALID_TOKEN' });
  }
}

function publicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getUserById,
  signToken,
  requireAuth,
  publicUser,
};
