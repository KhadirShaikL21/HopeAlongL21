# Production Deployment Configuration Guide

## Overview

This guide explains how to configure HopeAlong for production deployment.

## Frontend Deployment (Vercel)

### Configuration Files

- **Primary config:** `hopealong-frontend/vercel.json`
- **Environment:** `hopealong-frontend/.env.production`

### Environment Variables Set

```
VITE_API_URL=https://hopealongl21.onrender.com
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBLw087tIiGukZr2DLKwDkVPEyRxBE_tXA
```

### Steps to Deploy

1. Push code to GitHub
2. Vercel automatically picks up changes
3. Environment variables in `vercel.json` override local `.env` files
4. Frontend accessible at: `https://hopealong.vercel.app`

---

## Backend Deployment (Render/Railway)

### Configuration Files

- **Primary config:** `server/.env.production`
- **Deployment:** `server/railway.json`

### Environment Variables to Set in Deployment Platform

Set these in your hosting platform's environment variables dashboard:

```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://hopealong.vercel.app
GOOGLE_CALLBACK_URL=https://hopealongl21.onrender.com/api/auth/google/callback

# Keep these secure (never in git):
MONGO_URI=mongodb+srv://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
JWT_SECRET=...
GOOGLE_MAPS_API_KEY=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

### Current URLs

- **Frontend:** https://hopealong.vercel.app
- **Backend API:** https://hopealongl21.onrender.com

### Steps to Deploy

1. Push code to GitHub
2. Render watches repository and auto-deploys
3. Set environment variables in Render dashboard
4. API accessible at: `https://hopealongl21.onrender.com`

---

## CORS Configuration (server/server.js)

The code checks `NODE_ENV`:

- **Development:** Allows `http://localhost:5173`, `http://localhost:3000`
- **Production:** Uses `process.env.FRONTEND_URL` (must be set!)

```javascript
cors: {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}
```

**Important:** For production deployment, ensure `FRONTEND_URL` environment variable is set to your actual frontend domain.

---

## Google OAuth Configuration

### Local Development

- **Redirect URI:** `http://localhost:5000/api/auth/google/callback`
- **Config:** `.env` file

### Production

- **Redirect URI:** `https://hopealongl21.onrender.com/api/auth/google/callback`
- **Config:** Set `GOOGLE_CALLBACK_URL` in deployment platform

You may need to add the production redirect URI in Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to APIs & Services > Credentials
4. Edit OAuth 2.0 Client
5. Add authorized redirect URI: `https://hopealongl21.onrender.com/api/auth/google/callback`

---

## Environment Files Reference

### Development Flow

```
.env (local) → NODE_ENV=development
  └─ CORS: ✅ localhost:5173, localhost:3000
  └─ Frontend URL: http://localhost:5173
  └─ Google Callback: http://localhost:5000/...
```

### Production Flow

```
Deployment Platform Env Variables → NODE_ENV=production
  └─ CORS: ✅ FRONTEND_URL (from env var)
  └─ Frontend URL: https://hopealong.vercel.app
  └─ Google Callback: https://hopealongl21.onrender.com/...
```

---

## Testing Production Configuration Locally

To test production setup before deploying:

```bash
# Backend
NODE_ENV=production \
FRONTEND_URL=https://hopealong.vercel.app \
npm start

# Or set in .env.production file and load it
```

---

## Troubleshooting

### CORS Errors

- Check `FRONTEND_URL` matches your actual frontend domain
- Ensure `NODE_ENV=production` in deployment platform
- Verify no extra whitespace in environment variables

### Google OAuth Failing

- Verify `GOOGLE_CALLBACK_URL` is registered in Google Cloud Console
- Check that backend URL matches exactly (https vs http, domain, port)

### API Calls Failing

- Verify `VITE_API_URL` in frontend points to correct backend
- Check backend is running and accessible
- Verify CORS is configured correctly
