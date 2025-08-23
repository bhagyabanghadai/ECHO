# EchoDesign Backend - Railway/Glitch Deployment

This directory contains the backend files prepared for deployment on Railway, Glitch, or similar Node.js hosting platforms.

## 📁 Files Overview

- **`package.json`** - Dependencies and scripts
- **`index.js`** - Main server entry point
- **`config.js`** - Environment variable configuration
- **`db.js`** - Database connection setup
- **`schema.js`** - Database schema definitions
- **`storage.js`** - Database operations and queries
- **`routes.js`** - API routes and endpoints
- **`.env`** - Environment variables template
- **`README.md`** - This deployment guide

## 🚀 Railway Deployment Steps

### 1. Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Connect your GitHub account

### 2. Deploy from GitHub
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your EchoDesign repository
4. **Important:** Set the root directory to `glitch-deployment/`
5. Railway will auto-detect Node.js

### 3. Environment Variables
In Railway dashboard, add these environment variables:

```env
DATABASE_URL=your_neon_database_connection_string
SESSION_SECRET=your_secure_random_string_here
GLM_API_KEY=your_glm_api_key_for_emotion_analysis
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCrQ0b2jReh3V0g-hZMTsEZsBcsOVws8YQ
NODE_ENV=production
PORT=3000
```

### 4. Database Setup (Neon)
1. Go to https://neon.tech
2. Sign up (free tier: 512MB)
3. Create a new database
4. Copy the connection string
5. Add it to Railway as `DATABASE_URL`

### 5. Deploy & Test
1. Railway will build and deploy automatically
2. Monitor logs in Railway dashboard
3. Your API will be available at: `https://your-app-name.railway.app`

## 🔧 Alternative Platforms

### Glitch Deployment
1. Go to https://glitch.com
2. Create new project
3. Upload all files from this directory
4. Set environment variables in `.env`
5. Your app will be at: `https://your-project-name.glitch.me`

### Render Deployment
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Set root directory to `glitch-deployment/`
5. Build command: `npm install`
6. Start command: `npm start`

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user

### Memories
- `POST /api/memories` - Create new memory
- `GET /api/memories/near?lat=X&lng=Y&radius=Z` - Get memories near location
- `GET /api/memories/user` - Get user's memories

### Emotion Map
- `GET /api/emotion-map?lat=X&lng=Y` - Get emotion map data

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Health Check
- `GET /health` - Server health status

## 🔑 Environment Variables Explained

### Required
- **`DATABASE_URL`** - PostgreSQL connection string from Neon
- **`SESSION_SECRET`** - Random string for session encryption

### Optional
- **`GLM_API_KEY`** - For AI emotion analysis (fallback available)
- **`VITE_GOOGLE_MAPS_API_KEY`** - For frontend Google Maps
- **`NODE_ENV`** - Environment mode (production/development)
- **`PORT`** - Server port (auto-detected on most platforms)

## 🛠️ Local Testing

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Start server
npm start
```

## 🔧 Configuration Notes

### CORS Settings
The server is configured to accept requests from:
- `localhost:5000` (development)
- `localhost:3000` (alternative dev port)
- `*.render.com` (Render deployments)
- `*.railway.app` (Railway deployments)
- `*.glitch.me` (Glitch deployments)

### Database Schema
The app will automatically connect to your Neon database. Make sure to run the schema migrations on your main project first:

```bash
# In your main project directory
npm run db:push
```

### Fallback Systems
- **Emotion Analysis**: If GLM API is unavailable, uses keyword-based detection
- **Sample Data**: Provides demo emotion map data when database is empty

## 🚨 Troubleshooting

### Common Issues
1. **Build Failures**: Ensure all dependencies are in `package.json`
2. **Database Connection**: Verify `DATABASE_URL` format and credentials
3. **CORS Errors**: Update frontend API base URL to match deployed backend
4. **Environment Variables**: Double-check all required variables are set

### Logs
- **Railway**: Check logs in Railway dashboard
- **Glitch**: View logs in Glitch editor console
- **Render**: Monitor logs in Render dashboard

## 📞 Support

If you encounter issues:
1. Check the platform-specific logs
2. Verify environment variables
3. Test endpoints with tools like Postman
4. Ensure database is accessible

---

**Ready for deployment! 🚀**