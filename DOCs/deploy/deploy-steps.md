# ProfEnglish VPS Deploy (Docker'siz)

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
