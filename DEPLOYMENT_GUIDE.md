# Git deployment guide for Render.com

## Quick Start

1. **Prisijunk prie Render.com**
   - Nueik į https://render.com
   - Prisijunk su GitHub sąskaita

2. **Sukonfigūruok naujas web services**
   
   Reikės sukurti 3 services:
   
   a) **API Service**
   - `New+` → `Web Service`
   - Connected repo: `NojusGencas/Kream`
   - Build command: `cd api && npm install`
   - Start command: `cd api && npm start`
   - Environment:
     - JWT_SECRET: (random string)
     - DB_HOST: (will provide after DB setup)
     - EMAIL_PASS: (your password)
   
   b) **Front Service (React)**
   - `New+` → `Static Site`
   - Connected repo: `NojusGencas/Kream`
   - Build command: `cd front && npm install && npm run build`
   - Publish directory: `front/dist`
   
   c) **Admin Service (React)**
   - `New+` → `Static Site`
   - Connected repo: `NojusGencas/Kream`
   - Build command: `cd admin && npm install && npm run build`
   - Publish directory: `admin/dist`

3. **Pridėk MySQL Database**
   - `New+` → `MySQL`
   - Sukurkite database
   - Gauk connection string ir pridėk API environment

4. **Sukonfigūruok DNS (optional)**
   - Render suteiks URL kiekvienam servic'ui

## Environment Variables needed on Render:

API Service:
- JWT_SECRET
- EMAIL_PASS
- DATABASE_URL (from MySQL service)

## Notes:
- Render free tier may have limitations
- For production, consider paid plans
- Database backups are important
