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
  return JSON.parse(raw);
}

module.exports = { evaluateFinalAnswer };
