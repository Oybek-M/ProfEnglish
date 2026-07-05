const { callOpenRouter } = require('./openrouter');

async function evaluateFinalAnswer(lesson, level, finalAnswer) {
  const systemPrompt = `Sen tajribali ingliz tili baholovchisisan. Foydalanuvchining quyidagi yakuniy yozma javobini baho.
Vaziyat: ${lesson.finalTaskPrompt}
Til darajasi: ${level}

Javobni FAQAT quyidagi JSON formatda qaytar:
{
  "scores": {
    "vocabulary": number,
    "grammar": number,
    "fluency": number,
    "professionalPhrases": number,
    "communicationQuality": number,
    "confidence": number
  },
  "overallScore": number,
  "feedbackUz": "string"
}
Har bir ball 1 dan 10 gacha butun son bo'lsin. "feedbackUz" o'zbek tilida, 2-4 jumlali qisqa va aniq tavsiya bo'lsin.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: finalAnswer },
  ];

  const raw = await callOpenRouter({ messages, jsonMode: true, maxTokens: 500, temperature: 0.4 });

  if (!raw || typeof raw !== 'string' || raw.trim().length === 0) {
    throw new Error('AI_EMPTY_RESPONSE');
  }

  let evaluation;
  try {
    evaluation = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse AI evaluation response:', raw.slice(0, 500));
    throw new Error('AI_INVALID_JSON');
  }

  validateEvaluation(evaluation);

  return evaluation;
}

function validateEvaluation(evaluation) {
  const scoreFields = ['vocabulary', 'grammar', 'fluency', 'professionalPhrases', 'communicationQuality', 'confidence'];
  const scores = evaluation && evaluation.scores;
  if (!scores || typeof scores !== 'object') {
    throw new Error('AI_INVALID_SCHEMA');
  }
  for (const field of scoreFields) {
    if (!Number.isInteger(scores[field]) || scores[field] < 1 || scores[field] > 10) {
      throw new Error('AI_INVALID_SCHEMA');
    }
  }
  if (!Number.isInteger(evaluation.overallScore) || evaluation.overallScore < 1 || evaluation.overallScore > 10) {
    throw new Error('AI_INVALID_SCHEMA');
  }
  if (typeof evaluation.feedbackUz !== 'string' || evaluation.feedbackUz.trim().length === 0) {
    throw new Error('AI_INVALID_SCHEMA');
  }
}

module.exports = { evaluateFinalAnswer };
