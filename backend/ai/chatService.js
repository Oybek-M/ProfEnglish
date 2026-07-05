const { callOpenRouter } = require('./openrouter');

async function getRoleplayReply(lesson, level, history, userMessage) {
  const systemPrompt = `Sen ${level} darajadagi ingliz tili o'quvchisi bilan rol-o'yin (role-play) suhbat qurayotgan "${lesson.roleplayCharacter}" xarakteridasan.
Vaziyat: ${lesson.scenario}
Faqat inglizcha javob ber, ${level} darajasiga mos oddiy va tushunarli so'zlar ishlat.
Suhbatni tabiiy davom ettir, foydalanuvchi xato qilsa muloyimlik bilan tushuntir, lekin xarakteringdan chiqma.
Javobing 1-3 jumladan oshmasin.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: userMessage },
  ];

  const reply = await callOpenRouter({ messages, jsonMode: false, maxTokens: 300, temperature: 0.8 });
  return reply;
}

module.exports = { getRoleplayReply };
