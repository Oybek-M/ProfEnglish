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

  if (!raw || typeof raw !== 'string' || raw.trim().length === 0) {
    throw new Error('AI_EMPTY_RESPONSE');
  }

  let lesson;
  try {
    lesson = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse AI lesson response:', raw.slice(0, 500));
    throw new Error('AI_INVALID_JSON');
  }

  if (!Array.isArray(lesson.vocabulary) || lesson.vocabulary.length < 10) {
    throw new Error('AI_INVALID_SCHEMA');
  }
  if (!Array.isArray(lesson.exercises) || lesson.exercises.length !== 5) {
    throw new Error('AI_INVALID_SCHEMA');
  }
  if (lesson.exercises.some((ex) => !Array.isArray(ex.options) || ex.options.length !== 4)) {
    throw new Error('AI_INVALID_SCHEMA');
  }

  cache[key] = { generatedAt: new Date().toISOString(), lesson };
  writeJson(CACHE_FILE, cache);

  return { ...lesson, cacheKey: key };
}

module.exports = { getOrGenerateLesson, cacheKey };
