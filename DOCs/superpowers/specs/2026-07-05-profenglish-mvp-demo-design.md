# ProfEnglish — Demo Day MVP Dizayni

**Sana:** 2026-07-05
**Muddat:** Demo Day — 2026-07-06 (dushanba)
**Maqsad:** Investor/hamkorlarga "wow" effekt beruvchi, haqiqiy AI bilan ishlaydigan ishlaydigan demo

## 1. Kontekst

ProfEnglish — kasbiy ingliz tili o'rgatuvchi, AI asosida shaxsiylashtirilgan ta'lim platformasi (to'liq g'oya: `DOCs/ProfEnglish_Prev_Prompt.txt`). Bu dizayn to'liq mahsulot emas, balki **Demo Day uchun minimal, lekin haqiqiy ishlaydigan** web-app'ni tavsiflaydi.

## 2. Ko'lam

### Ichida (MVP demo)
- Ro'yxatdan o'tish / kirish (email + parol)
- Onboarding: kasb tanlash (IT yoki Business), daraja aniqlovchi test (8-10 savol), maqsad tanlash
- AI orqali shaxsiy dars generatsiyasi (foydalanuvchining tayyor 10-bosqichli prompti asosida)
- Dars sahifasi: kontent bloklari + interaktiv mashqlar + AI role-play chat + yozma yakuniy sinov + AI baholash
- Natija va takrorlash ro'yxati sahifasi
- VPS'ga subdomain orqali deploy

### Tashqarida (keyingi bosqichga qoldirilgan)
- Speaking/audio baholash (Speech-to-Text) — o'rniga Writing/matn baholash ishlatiladi
- Admin panel
- To'lov/obuna tizimi
- Sertifikatlar
- Mobil ilova
- Google OAuth (faqat email+parol)
- Avtomatik test suite (qo'lda smoke-test bilan tekshiriladi)

## 3. Arxitektura

```
Brauzer (foydalanuvchi)
   │
   ▼
Nginx (mavjud VPS) — subdomain server block, SSL
   │  proxy_pass
   ▼
Node.js + Express (bitta process, PM2 bilan boshqariladi)
   ├── /api/*        → backend endpointlar
   └── /* (boshqa)   → build qilingan React static fayllar (express.static)
   │
   ├── JSON-fayl saqlash (data/*.json)
   └── OpenRouter API (openai/gpt-4o-mini) — AI chaqiruvlari
```

- **Frontend:** React + Vite + TypeScript + TailwindCSS (SPA, mobil-responsive)
- **Backend:** Node.js + Express, bitta server process
- **Saqlash:** DB yo'q — JSON-fayl asosida (`data/users.json`, `data/progress.json`, `data/lessons-cache.json`)
- **Auth:** email + parol, bcrypt hash, JWT sessiya tokeni
- **AI:** OpenRouter API, model — `openai/gpt-4o-mini`
- **Deploy:** Docker'siz — PM2 process manager + mavjud Nginx reverse proxy, yangi subdomain

## 4. Ma'lumotlar strukturasi

**User**
```
{ id, email, passwordHash, profession: "it"|"business", level: "A1".."C1",
  goal: string, createdAt }
```

**LessonCache** (kalit: `profession+level+goal` kombinatsiyasi)
```
{ cacheKey, generatedAt, lessonData: { ...AI'dan kelgan 10-bosqichli struktura... } }
```

**Progress**
```
{ userId, lessonId, currentStep, answers: [...], finalEvaluation: {...}, completedAt }
```

Daraja test savollari va onboarding variantlari — statik JSON fayl sifatida backend/frontendda saqlanadi (AI generatsiya qilmaydi, oldindan tayyorlangan 8-10 savol).

## 5. Foydalanuvchi oqimi

1. **Landing** → "Boshlash" tugmasi → Ro'yxatdan o'tish/Kirish
2. **Onboarding** (3 qadam, progress-bar bilan):
   - Kasb: IT (Dasturlash) yoki Business kartochkalar
   - Daraja testi: 8-10 savol (statik, oldindan tayyorlangan), natija asosida A1-C1 darajasi hisoblanadi
   - Maqsad: fixed variantlar (ishga kirish, xalqaro mijozlar bilan ishlash, IELTS, karyera o'sishi)
3. **AI dars generatsiyasi**: "AI shaxsiy darsingizni tayyorlamoqda..." holati → backend cache tekshiradi → mavjud bo'lmasa OpenRouter'ga so'rov → natija keshlanadi
4. **Dashboard**: generatsiya qilingan darsga o'tish tugmasi
5. **Dars sahifasi** (AI prompt asosidagi 10 bosqich, quyidagicha guruhlangan):
   - Bloklar 1-4 (ma'lumot, missiya, stsenariy, lug'at/iboralar) — AI kontenti, o'qish uchun ko'rsatiladi
   - Bloklar 5-6 (mashqlar) — AI javobida keladigan variantlar bilan interaktiv (moslashtirish, bo'shliq to'ldirish va h.k.), qo'shimcha AI chaqiruvisiz client-side tekshiriladi
   - Blok 7 — **AI role-play chat** (jonli, real vaqt AI chaqiruvi)
   - Blok 8 — yakuniy yozma sinov (foydalanuvchi erkin matn kiritadi)
   - Blok 9 — **AI baholash** (jonli AI chaqiruvi): lug'at, grammatika, ravonlik, kasbiy ibora, muloqot sifati bo'yicha ball + tavsiya
   - Blok 10 — takrorlash ro'yxati (AI dars ma'lumotidan olinadi, qo'shimcha chaqiruv kerak emas)
6. **Natija sahifasi**: umumiy ball, takrorlash ro'yxati

## 6. AI integratsiyasi

- **Model:** `openai/gpt-4o-mini` (OpenRouter orqali)
- **System prompt:** foydalanuvchi tomonidan tayyorlangan 10-bosqichli dars generatsiya prompti (`DOCs/ProfEnglish_Prev_Prompt.txt`dagi "SYSTEM PROMPT" bo'limi), JSON formatda structured output qaytarish uchun moslashtiriladi
- **Xarajatni tejash strategiyasi:**
  - Dars generatsiyasi — `profession+level+goal` kombinatsiyasi bo'yicha keshlanadi (bir marta generatsiya qilingach, qayta so'rov yubormaydi)
  - Faqat role-play chat va yakuniy baholash har safar jonli chaqiriladi (bular haqiqiy interaktivlikni ko'rsatishi shart)
  - Demo kuni oldidan IT va Business uchun darslarni oldindan bir marta generatsiya qilib "isitib qo'yish" (warm-up) tavsiya etiladi — bu kod jonli/dinamik bo'lib qoladi, faqat demo paytida birinchi so'rov kutish vaqtini oldini oladi

## 7. Deploy rejasi

1. Frontend build (`npm run build`) → static fayllar
2. Backend + build qilingan frontend static fayllarni bitta serverga joylash
3. `.env` faylda `OPENROUTER_API_KEY`, `JWT_SECRET` — git'ga commit qilinmaydi (`.gitignore`)
4. PM2 orqali ishga tushirish (`pm2 start server.js --name profenglish`)
5. Nginx'da yangi subdomain uchun server block — `proxy_pass http://localhost:<PORT>`
6. SSL — mavjud certbot jarayoni orqali (agar boshqa subdomainlar shu tarzda sozlangan bo'lsa)

## 8. Xatarlar va yumshatish

| Xavf | Yumshatish |
|---|---|
| Demo paytida AI javobi sekin/xato chiqishi | Dars kontenti oldindan keshlanadi; faqat chat/baholash jonli qoladi |
| OpenRouter model g'alati JSON qaytarishi | JSON-mode/format tekshiruvi + parse xato bo'lsa fallback statik namunaviy dars |
| Vaqt yetishmasligi (1 kun qoldi) | Avtomatik test yo'q — qo'lda golden-path smoke test (ro'yxatdan o'tish → onboarding → dars → chat → baholash) demo oldidan albatta bajariladi |
