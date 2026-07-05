const LEVEL_TEST_QUESTIONS = [
  { id: 1, question: 'She ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], correctIndex: 1 },
  { id: 2, question: 'I have lived here ___ 2015.', options: ['since', 'for', 'from', 'at'], correctIndex: 0 },
  { id: 3, question: 'If I ___ more time, I would learn French.', options: ['have', 'had', 'has', 'will have'], correctIndex: 1 },
  { id: 4, question: 'By next year, she ___ her degree.', options: ['will complete', 'will have completed', 'completes', 'completed'], correctIndex: 1 },
  { id: 5, question: 'Choose the closest synonym for "significant":', options: ['small', 'important', 'quick', 'rare'], correctIndex: 1 },
  { id: 6, question: 'He is the man ___ car was stolen.', options: ['who', 'which', 'whose', 'whom'], correctIndex: 2 },
  { id: 7, question: 'Neither the manager nor the employees ___ aware of the change.', options: ['was', 'were', 'is', 'has'], correctIndex: 1 },
  { id: 8, question: 'Choose the word closest in meaning to "meticulous":', options: ['careless', 'careful', 'fast', 'lazy'], correctIndex: 1 },
  { id: 9, question: 'Had I known about the meeting, I ___ attended.', options: ['would', 'will', 'would have', 'had'], correctIndex: 2 },
  { id: 10, question: 'Choose the correct passive form of "They are building a new office.":', options: ['A new office is built by them', 'A new office is being built by them', 'A new office was being built', 'A new office has built'], correctIndex: 1 },
];

function scoreToLevel(score) {
  if (score <= 2) return 'A1';
  if (score <= 4) return 'A2';
  if (score <= 6) return 'B1';
  if (score <= 8) return 'B2';
  return 'C1';
}

function calculateLevel(answerIndexes) {
  let score = 0;
  LEVEL_TEST_QUESTIONS.forEach((q, i) => {
    if (answerIndexes[i] === q.correctIndex) score += 1;
  });
  return { score, level: scoreToLevel(score) };
}

function publicQuestions() {
  return LEVEL_TEST_QUESTIONS.map(({ id, question, options }) => ({ id, question, options }));
}

module.exports = { LEVEL_TEST_QUESTIONS, calculateLevel, publicQuestions };
