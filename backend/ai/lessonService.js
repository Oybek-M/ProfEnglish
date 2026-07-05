const { readJson, writeJson } = require('../data/store');
const { callOpenRouter } = require('./openrouter');
const { buildLessonMessages } = require('./lessonPrompt');

const CACHE_FILE = 'lessons-cache.json';

function cacheKey(profession, level, goal) {
  return `${profession}_${level}_${goal}`;
}

async function getOrGenerateLesson(profession, level, goal) {
  const key = cacheKey(profession, level, goal);
  const cache = readJson(CACHE_FILE, {});

  if (cache[key]) {
    return { ...cache[key].lesson, cacheKey: key };
  }

  const messages = buildLessonMessages(profession, level, goal);
  const raw = await callOpenRouter({ messages, jsonMode: true, maxTokens: 3000, temperature: 0.6 });

  let lesson;
  try {
    lesson = JSON.parse(raw);
  } catch (err) {
    throw new Error('AI_INVALID_JSON');
  }

  cache[key] = { generatedAt: new Date().toISOString(), lesson };
  writeJson(CACHE_FILE, cache);

  return { ...lesson, cacheKey: key };
}

module.exports = { getOrGenerateLesson, cacheKey };
