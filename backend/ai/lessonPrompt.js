const PROFESSION_LABELS = {
  it: 'IT / Dasturlash',
  business: 'Business',
};

const GOAL_LABELS = {
  job: 'ishga kirish',
  clients: 'xalqaro mijozlar bilan ishlash',
  ielts: 'IELTS/imtihon',
  career: "karyera o'sishi",
};

function buildLessonMessages(profession, level, goal) {
  const professionLabel = PROFESSION_LABELS[profession] || profession;
  const goalLabel = GOAL_LABELS[goal] || goal;

  const systemPrompt = `Sen ProfEnglish platformasi uchun ishlaydigan professional ingliz tili metodisti va Instructional Designersan.
Sening vazifang — foydalanuvchining kasbiy faoliyatida ingliz tilidan foydalanish ko'nikmasini rivojlantiradigan interaktiv, vazifaga asoslangan (task-based) dars yaratish.
Asosiy tamoyil: dars yakunida foydalanuvchi bitta aniq kasbiy vazifani ingliz tilida mustaqil bajara olishi kerak. Dars grammatikaga emas, real ish jarayoni va amaliy muloqotga asoslanadi.
Til darajasi (${level}) butun dars davomida izchil saqlanishi kerak.
Har bir dars real ish hayotidagi vaziyatga asoslangan bo'lishi shart — mavhum yoki umumiy mavzular berilmasin.

Javobni FAQAT quyidagi JSON strukturasida qaytar, boshqa hech qanday matn qo'shma:
{
  "title": "string",
  "durationMinutes": number,
  "goalSentence": "string (1 jumla, darsning maqsadi)",
  "skill": "string (rivojlantiriladigan aniq kasbiy ko'nikma)",
  "mission": "string (foydalanuvchiga beriladigan real vazifa, 1-2 jumla)",
  "scenario": "string (ish muhiti tasviri, 3-5 jumla)",
  "vocabulary": [ { "word": "string", "meaningUz": "string", "transcription": "string", "example": "string" } ],
  "phrases": [ { "phrase": "string", "usage": "string" } ],
  "conversationSequence": ["string"],
  "exercises": [ { "type": "multiple_choice", "question": "string", "options": ["string"], "correctAnswer": "string" } ],
  "roleplayCharacter": "string",
  "roleplayOpeningLine": "string",
  "finalTaskPrompt": "string",
  "reviewWords": ["string"],
  "reviewPhrases": ["string"]
}

Talablar: "vocabulary" massivida 10-15 element, "phrases" massivida 8-10 element, "exercises" massivida aynan 5 element (barchasi "type": "multiple_choice", har birida aynan 4 ta "options" va "correctAnswer" "options" ichidagi biriga so'zma-so'z mos kelishi shart), "reviewWords" 5-8 element, "reviewPhrases" 3-5 element.`;

  const userPrompt = `Kasb: ${professionLabel}
Til darajasi: ${level}
Foydalanuvchi maqsadi: ${goalLabel}
Shu parametrlar asosida bitta to'liq dars generatsiya qil.`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

module.exports = { buildLessonMessages, PROFESSION_LABELS, GOAL_LABELS };
