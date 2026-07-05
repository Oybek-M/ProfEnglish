# Demo Day oldidan qo'lda tekshirish ro'yxati

Ikkalasi ham ishga tushirilgan holda (`cd backend && node server.js`, frontend production build orqali xizmat qiladi — Task 17dagidek):

- [x] Landing page ochiladi, "Bepul boshlash" tugmasi ishlaydi
- [x] Ro'yxatdan o'tish: yangi email+parol bilan muvaffaqiyatli ro'yxatdan o'tadi
- [x] Onboarding — IT stsenariysi: IT tanlanadi → 10 ta savolga javob beriladi → maqsad tanlanadi → Dashboard'ga o'tadi
- [x] Dashboard: "AI dars tayyorlamoqda..." ko'rinadi, so'ng dars nomi bilan tugma chiqadi (bu — birinchi marta AI'ni "isitib qo'yish", keshlanadi)
- [x] Dars sahifasi: info/missiya/stsenariy to'g'ri ko'rinadi
- [x] Lug'at va iboralar bloki to'liq render bo'ladi (bo'sh joy yo'q)
- [x] Mashqlar: variant bosilganda to'g'ri/xato rangda belgilanadi
- [x] AI chat: xabar yuborilganda, xarakterga mos, inglizcha javob keladi (real vaqt, kechikish qabul qilinadi)
- [x] Yakuniy sinov: matn kiritilib yuborilganda, ballar va o'zbekcha fikr-mulohaza chiqadi
- [x] Review blok: so'zlar/iboralar ro'yxati ko'rinadi, "Natijani ko'rish" natija sahifasiga o'tadi
- [x] Xuddi shu oqim **Business** kasbi bilan ham takrorlanadi (alohida foydalanuvchi bilan)
- [x] Chiqish (logout) va qayta kirish ishlaydi
- [x] Mobil o'lchamda asosiy sahifalar buzilmaydi

**Muhim:** Bu tekshiruvni demo kunidan oldin, kamida bir marta IT va bir marta Business kombinatsiyasi bilan to'liq bajaring — bu ikkala dars ham `backend/data/lessons-cache.json` ichida keshlanib qoladi, shuning uchun haqiqiy demo paytida sahnada birinchi AI generatsiya kutish vaqti bo'lmaydi.

---

## Bajarilgan tekshiruv natijalari (2026-07-05)

Production build (`frontend/dist`, `http://localhost:5001` orqali Express serveri) va Chrome brauzer avtomatizatsiyasi orqali quyidagilar haqiqatan ham bajarildi va tasdiqlandi:

- **IT profession** (`smoketest1@example.com`, keyin `prodtest1@example.com` — Business uchun alohida foydalanuvchi): Ro'yxatdan o'tish → Onboarding (10 savol) → Dashboard (real AI dars generatsiyasi — "Job Interview for an IT Position") → Lesson (info/13 so'z+8 ibora/5 mashq — to'g'ri/xato ranglar tasdiqlandi) → AI rol-o'yin chat (real OpenRouter javobi, xarakterga mos) → Yakuniy sinov (real ball + o'zbekcha fikr-mulohaza; bitta o'tkinchi 502 xatosi ro'y berdi va xato UI'si mos ravishda ko'rsatildi, qayta urinishda muvaffaqiyatli o'tdi) → Review → `/result` sahifasi.
- **Business profession** (`prodtest1@example.com`): xuddi shu oqim to'liq takrorlandi — "Meeting with International Clients" darsi, AI chat "International Client" xarakteri bilan, yakuniy baholash va natija sahifasi — barchasi ishladi.
- **Production build orqali to'g'ridan-to'g'ri URL yangilash** (`http://localhost:5001/result` ga hard-refresh): SPA to'g'ri render bo'ldi, Express'ning catch-all fallback'i ishlayapti.
- **Logout/qayta login**: Dashboard sahifasiga "Chiqish" tugmasi qo'shildi (bu Task 1-18'da yo'q edi, Task 19 smoke testida aniqlangan bo'shliq) — logout `/login`ga yo'naltiradi, qayta kirishda foydalanuvchi keshlangan darsiga qaytadi.
- **Mobil moslashuvchanlik**: Bu muhitda avtomatlashtirilgan brauzer viewport'ni haqiqatda mobil o'lchamga o'zgartirib bo'lmadi (resize buyrug'i window'ni o'zgartirdi, lekin sahifa viewport'i 1440px'da qoldi). Shuning uchun kod darajasida audit qilindi: barcha sahifalar (`frontend/src/pages/*.tsx`) faqat `max-w-*` + markazlashtirilgan flex + `px-4` naqshlaridan foydalanadi, hech qanday qattiq piksel kengligi (`w-[...]`) ishlatilmagan — bu Tailwind'ning mobile-first yondashuviga mos. **Demo kunidan oldin haqiqiy brauzer devtools responsive rejimida (yoki haqiqiy telefonda) qo'lda bir marta ko'rib chiqish tavsiya etiladi**, chunki bu yerda faqat statik kod auditi bilan cheklandik.

**Xulosa:** MVP demo uchun golden path (ikkala kasb) to'liq ishlaydi, real AI (OpenRouter `gpt-4o-mini`) barcha uchta integratsiya nuqtasida (dars generatsiyasi, rol-o'yin chat, yozma baholash) muvaffaqiyatli ishladi, xatoliklarga chidamlilik (error handling) amalda tasdiqlandi.
