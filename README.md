# ECHO - Emotional Connection Hub & Optimization

🌟 A revolutionary web application that visualizes and analyzes human emotions through interactive maps and AI-powered insights.

## 🚀 Features

- **Interactive Emotion Map**: Visualize emotions across different locations using Google Maps integration
- **AI-Powered Analysis**: Advanced emotion detection and analysis using GLM API
- **User Authentication**: Secure login and registration system
- **Real-time Dashboard**: Live emotion data and analytics
- **Responsive Design**: Beautiful, modern UI built with React and Tailwind CSS
- **Database Integration**: PostgreSQL with Drizzle ORM for data persistence

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Query** for data fetching
- **React Hook Form** for form management
- **Google Maps API** for map visualization

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **GLM API** for AI-powered emotion analysis
- **Session-based authentication**

## 📁 Project Structure

```
ECHO/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Backend Express server
│   ├── auth.ts           # Authentication logic
│   ├── config.ts         # Environment configuration
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
├── dist/                 # Built application (generated)
└── package.json          # Dependencies and scripts
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 20+ installed
- PostgreSQL database
- Google Maps API key
- GLM API key

### 1. Clone the Repository
```bash
git clone https://github.com/bhagyabanghadai/ECHO.git
cd ECHO
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/echo_db
GLM_API_KEY=your_glm_api_key_here
SESSION_SECRET=your_session_secret_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NODE_ENV=development
PORT=5000
```

### 4. Database Setup
```bash
# Generate database schema
npm run db:generate

# Push schema to database
npm run db:push
```

### 5. Build the Application
```bash
npm run build
```

### 6. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Deployment Platforms

#### Render (Recommended)
- **Service Type**: Web Service
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `.`
- **Environment Variables**: Add all variables from `.env`

#### Alternative Platforms
- **Vercel**: Supports full-stack Node.js applications
- **Railway**: Free tier available for Node.js apps
- **Fly.io**: Container-based deployment
- **Cyclic.sh**: Simple Node.js hosting

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type checking
- `npm run db:push` - Push database schema
- `npm run db:generate` - Generate database migrations
- `npm run db:studio` - Open database studio

## 🔍 About .replit File

The `.replit` file is a configuration file for **Replit**, an online IDE and hosting platform. It specifies:

```
modules = ["nodejs-20", "web", "postgresql-16"]
```

- **nodejs-20**: Enables Node.js 20 runtime environment
- **web**: Provides web hosting capabilities
- **postgresql-16**: Sets up PostgreSQL 16 database

This file allows the project to run seamlessly on Replit with all required dependencies and services pre-configured.

## 🌐 API Endpoints

- `GET /api/auth/me` - Get current user
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/emotions/map` - Get emotion map data
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Blank screen on deployment**: Ensure you're deploying as a Web Service, not Static Site
2. **API calls failing**: Check environment variables are properly set
3. **Database connection issues**: Verify DATABASE_URL format and credentials
4. **Build failures**: Ensure all dependencies are installed with `npm install`

### Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for emotional intelligence and human connection**