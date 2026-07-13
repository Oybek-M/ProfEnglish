# ProfEnglish VPS Deploy (Docker'siz)

## Real production holati (2026-07-13 dan boshlab: profenglish.uz)

- **VPS:** `109.199.108.248` (Ubuntu 24.04), boshqa loyihalar bilan bir xil shared VPS (`/var/www/` ostida `ibos_crm`, `SmartCrm` va h.k. bilan bir qatorda)
- **Domen:** `https://profenglish.uz` (+ `www.profenglish.uz`) — ahost'dan sotib olingan mustaqil domen. Ilgari `profenglish.ibos.uz` sub-domenida ishlagan, 2026-07-13'da to'liq shu yangi domenga ko'chirildi (eski subdomain Nginx config va SSL sertifikati o'chirildi, redirect ham qoldirilmadi — founder talabi bo'yicha).
- **Path:** `/var/www/profenglish`
- **Process manager:** PM2 (`pm2 restart profenglish` / `pm2 logs profenglish`) — server reboot bo'lsa ham avtomatik ishga tushadi (`pm2 startup` + `pm2 save` sozlangan)
- **SSL:** Let's Encrypt (certbot), avtomatik yangilanadi, muddati 2026-10-11 (`profenglish.uz` + `www.profenglish.uz` bitta sertifikatda)
- **SSH kirish:** parol emas, alohida deploy-key (`~/.ssh/profenglish_deploy_ed25519` — mahalliy dev mashinada) orqali, `root@109.199.108.248`. VPS root paroli faqat shu kalitni bir martalik o'rnatish uchun ishlatildi va boshqa hech qayerda saqlanmadi.
- **Foydalanuvchi ma'lumotlari:** `backend/data/users.json` va `progress.json` production'da faqat 3 ta hisobni saqlaydi — `oybek@gmail.com` (asoschi), `demo.it@profenglish.uz`, `demo.biznes@profenglish.uz` (test/demo hisoblar uchun). Boshqa barcha test email'lar (`test_*@example.com`, `smoketest1`, `prodtest1`, `visualcheck`, `flowcheck1` va h.k.) o'chirilgan. `lessons-cache.json` foydalanuvchiga bog'liq emas (kalit: `profession_level_goal`), shuning uchun to'liq saqlab qolindi.

## Qo'lda deploy qadamlari (referens / keyingi marta boshqa VPS kerak bo'lsa)

1. Kodni VPS'ga yuklash (masalan `/var/www/profenglish`):
   `git clone <repo-url> /var/www/profenglish`

2. Backend paketlarni o'rnatish:
   `cd /var/www/profenglish/backend && npm install --production`

3. `.env` faylni VPS'da yaratish (git'ga kirmagan, qo'lda ko'chiriladi):
   `OPENROUTER_API_KEY=...`, `JWT_SECRET=...`, `PORT=5001`

4. Frontend'ni build qilish:
   `cd /var/www/profenglish/frontend && npm install && npm run build`

5. PM2 o'rnatish (agar yo'q bo'lsa) va ishga tushirish:
   `npm install -g pm2`
   `cd /var/www/profenglish/backend && pm2 start ecosystem.config.js`
   `pm2 save`

6. Nginx: `DOCs/deploy/nginx-profenglish.conf` shablonidagi `SIZNING-DOMENINGIZ.uz` qismini haqiqiy domenga almashtirib, `/etc/nginx/sites-available/profenglish` ga joylash, so'ng:
   `ln -s /etc/nginx/sites-available/profenglish /etc/nginx/sites-enabled/`
   `nginx -t && systemctl reload nginx`

7. SSL: `certbot --nginx -d profenglish.SIZNING-DOMENINGIZ.uz`

8. Keyingi deploylar uchun: `git pull`, backend/frontend paketlarini qayta o'rnatish (agar package.json o'zgargan bo'lsa), `npm run build` (frontend), `pm2 restart profenglish`.

## Keyingi yangilanish (real production, tayyor kalit bilan)

```bash
ssh -i ~/.ssh/profenglish_deploy_ed25519 root@109.199.108.248
cd /var/www/profenglish
git pull
cd backend && npm install --omit=dev
cd ../frontend && npm install && npm run build
pm2 restart profenglish
```

`backend/data/*.json` va `backend/.env` git'ga kirmaydi — bular serverda alohida turadi, `git pull` ularga tegmaydi.
