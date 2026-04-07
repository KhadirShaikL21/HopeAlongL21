# HopeAlong Production Environment Variables Setup

## 🚀 Deploy to Render (Backend)

Set these environment variables in your Render.com dashboard:

```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://hopealong.vercel.app
BACKEND_URL=https://hopealongl21.onrender.com

MONGO_URI=mongodb+srv://khadir190305:V0Kr3rdRKfQgPSvJ@cluster0.vindjsc.mongodb.net/hopeAlong?retryWrites=true&w=majority&appName=Cluster0

GOOGLE_CLIENT_ID=248244395536-9et1ul62dblkonj4asp4te03rg51e7kc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://hopealongl21.onrender.com/api/auth/google/callback

JWT_SECRET=hopealong_super_secret_jwt_key_2024_development_local

GOOGLE_MAPS_API_KEY=AIzaSyBLw087tIiGukZr2DLKwDkVPEyRxBE_tXA

RAZORPAY_KEY_ID=rzp_test_2DY4WhMDDHSBLH
RAZORPAY_KEY_SECRET=FZKutgPwS5RoKOqheAK6KetG
```

## 🎨 Deploy to Vercel (Frontend)

**Production URLs automatically configured in `vercel.json`:**

```json
{
  "env": {
    "VITE_API_URL": "https://hopealongl21.onrender.com"
  }
}
```

The frontend will be automatically deployed to: **https://hopealong.vercel.app**

## ✅ Verification Checklist

### Backend (https://hopealongl21.onrender.com)

- [ ] Server starts correctly with production URLs
- [ ] CORS allows requests from `https://hopealong.vercel.app`
- [ ] Google OAuth callback works (`/api/auth/google/callback`)
- [ ] Socket.io CORS configured for production
- [ ] MongoDB connection successful

### Frontend (https://hopealong.vercel.app)

- [ ] API calls use `https://hopealongl21.onrender.com`
- [ ] Login with Google works
- [ ] Chat/Socket.io connection works
- [ ] Live tracking updates work
- [ ] Payments process correctly

## 🔧 Environment Variable Mapping

| Variable              | Development                                      | Production                                                   |
| --------------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| `NODE_ENV`            | `development`                                    | `production`                                                 |
| `FRONTEND_URL`        | `http://localhost:5173`                          | `https://hopealong.vercel.app`                               |
| `BACKEND_URL`         | `http://localhost:5000`                          | `https://hopealongl21.onrender.com`                          |
| `GOOGLE_CALLBACK_URL` | `http://localhost:5000/api/auth/google/callback` | `https://hopealongl21.onrender.com/api/auth/google/callback` |
| `VITE_API_URL`        | `http://localhost:5000`                          | `https://hopealongl21.onrender.com`                          |

## 📌 Important Notes

1. **Never commit `.env` file to Git** - Only commit `.env.example`
2. **Google OAuth Setup** - Add production redirect URI in Google Cloud Console:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Edit OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://hopealongl21.onrender.com/api/auth/google/callback`

3. **CORS Configuration** - Automatically handled by:
   - `server.js` checks `NODE_ENV` and `FRONTEND_URL`
   - For production: uses `process.env.FRONTEND_URL` value
   - Fallback: `https://hopealong.vercel.app`

4. **Socket.io** - Automatically configured for both dev and production via `getAllowedOrigins()` function

## 🐛 Troubleshooting

### CORS Error: "Origin is not allowed"

- Verify `FRONTEND_URL` is set in Render dashboard
- Check that `NODE_ENV=production`
- Ensure no trailing slashes or whitespace in URLs

### Google OAuth Redirect Error

- Verify `GOOGLE_CALLBACK_URL` is set correctly
- Add URL to Google Cloud Console authorized redirect URIs
- Backend must be running at the exact URL specified

### API calls to localhost

- Check `VITE_API_URL` in `vercel.json` is `https://hopealongl21.onrender.com`
- Never use `http://` in production (must be `https://`)

### Socket.io Connection Failed

- Verify ports are not blocked
- Check `getAllowedOrigins()` includes your frontend URL
- Ensure WebSocket protocol is enabled in production
