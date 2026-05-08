# KREAM Project - Vercel + Render Deployment Guide

## 🎯 Final Deployment URLs

After setup, your project will be live at:

```
API:   https://api-rjrt.onrender.com
Front: https://front-kream.vercel.app
Admin: https://admin-kream.vercel.app
```

---

## 📋 Prerequisites

1. ✅ GitHub account (already have)
2. ✅ Vercel account (https://vercel.com)
3. ✅ Render account (already have)

---

## 🚀 Step 1: Deploy API to Render (Already Running!)

Your API is already deployed at **https://api-rjrt.onrender.com**

**Important:** Set these Environment Variables in Render API Settings:
```
JWT_SECRET=super_secret_key_12345
NODE_ENV=production
PORT=3000
DB_HOST=localhost  (or your remote DB)
DB_USER=root
DB_PASSWORD=root
DB_NAME=cakescatalog
```

---

## 🌐 Step 2: Deploy Front to Vercel

### 2.1 Prisijungti prie Vercel

1. Nueiti https://vercel.com
2. Paspaudžia **"Sign Up"** -> GitHub
3. Authorize Vercel

### 2.2 Deploy Front React App

1. Dashboard -> **"Add New..."** -> **"Project"**
2. Pasirinki **NojusGencas/Kream** repository
3. **Framework Preset**: Select **"Vite"**
4. **Root Directory**: `front`
5. **Build Command**: `npm run build` (auto-detected)
6. **Output Directory**: `dist` (auto-detected)

### 2.3 Environment Variables (Vercel)

Add in **Settings** -> **Environment Variables**:
```
VITE_API_URL = https://api-rjrt.onrender.com
```

7. Paspaudžia **"Deploy"**
8. **✅ Front live!** https://front-kream.vercel.app (URL gali skirtis)

---

## 🎨 Step 3: Deploy Admin to Vercel

Same process as Front:

1. Dashboard -> **"Add New..."** -> **"Project"**
2. Pasirinki **NojusGencas/Kream**
3. **Root Directory**: `admin`
4. **Framework**: **"Vite"**

### Environment Variables:
```
VITE_API_URL = https://api-rjrt.onrender.com
```

5. Deploy -> **✅ Admin live!**

---

## 🔗 Connect Everything

After deployment, update your frontends to use real API:

### Frontend (Front):

Check [front/src/components/ProductCatalog.jsx](../front/src/components/ProductCatalog.jsx):

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Fetch example:
fetch(`${API_URL}/api/products`)
```

### Admin Dashboard:

Check [admin/src/App.jsx](../admin/src/App.jsx) - update API calls similarly

---

## ✅ Testing

1. **API** -> https://api-rjrt.onrender.com
   - Should return JSON or 404 (not connection error)

2. **Front** -> https://front-kream.vercel.app
   - Should show website
   - API calls work

3. **Admin** -> https://admin-kream.vercel.app
   - Should show dashboard
   - Can login/manage content

---

## 🛠️ Troubleshooting

### API returns 503/Connection Error
- Check Render Environment Variables
- Verify DB connection
- Check logs: https://dashboard.render.com

### Frontend shows blank page
- Check browser Console (F12) for errors
- Verify VITE_API_URL is set correctly
- Check Vercel Logs: https://vercel.com/dashboard

### CORS errors
- Add CORS headers to API (app.js already has it)

---

## 🔄 Updates (Auto-Deploy)

1. Push to GitHub `main` branch
2. Vercel + Render auto-rebuild 🚀
3. Live within 2-5 minutes!

---

## 📞 Need Help?

- Render Logs: https://dashboard.render.com
- Vercel Logs: https://vercel.com/dashboard
- GitHub: https://github.com/NojusGencas/Kream

**Happy deploying!** 🎉
