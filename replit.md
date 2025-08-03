# ECHO - Emotional Memory Social Network

## Project Overview

ECHO is a full-stack web application that combines Java Spring Boot backend with React TypeScript frontend to create an advanced geospatial emotional memory platform. Users can create, share, and discover emotional memories with location-based features and AI-powered sentiment analysis.

## Architecture

### Backend: Java Spring Boot
- **Framework**: Spring Boot 3.2.0 with Java 21
- **Database**: PostgreSQL with JPA/Hibernate
- **Security**: Spring Security with session-based authentication
- **Audio Processing**: Vosk speech-to-text integration
- **REST API**: Full CRUD operations for users and memories

### Frontend: React TypeScript
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: CSS with custom components
- **Icons**: Lucide React
- **HTTP Client**: Axios with session-based authentication

### Database Schema
- **Users**: id, username, email, password, avatar, bio, has_completed_onboarding, created_at, updated_at
- **Memories**: id, title, description, content, emotion, emotion_confidence, latitude, longitude, audio_data, duration, user_id, created_at, updated_at
- **Memory Unlocks**: id, memory_id, user_id, unlocked_at

## Key Features

1. **User Authentication**: Register, login, logout with session management
2. **Memory Management**: Create, read, update, delete emotional memories
3. **Geolocation**: Location-based memory discovery and mapping
4. **Emotion Analysis**: AI-powered sentiment analysis of memories
5. **Audio Processing**: Speech-to-text conversion for voice memories
6. **Social Features**: Memory sharing and discovery

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Memories
- `POST /api/memories` - Create new memory
- `GET /api/memories/user` - Get user's memories
- `GET /api/memories/nearby/{lat}/{lng}` - Get nearby memories
- `GET /api/memories/emotion/{emotion}` - Get memories by emotion
- `GET /api/memories/stats` - Get emotion statistics
- `DELETE /api/memories/{id}` - Delete memory
- `POST /api/memories/upload-audio` - Process audio memory

## Running the Application

### Prerequisites
- Java 21
- Node.js 20+
- PostgreSQL database (provided by Replit)

### Development Setup
1. **Backend**: `mvn spring-boot:run` (runs on port 5000)
2. **Frontend Development**: `cd frontend && vite` (for development with hot reload)
3. **Frontend Production**: `cd frontend && vite build` (builds to `src/main/resources/static`)

### Production Build
1. Build frontend: `cd frontend && vite build`
2. Run Spring Boot: `mvn spring-boot:run`
3. Access application at: `http://localhost:5000`

## Current Status

✅ **Completed & Tested:**
- Java Spring Boot backend with full REST API running on port 5000
- React TypeScript frontend built and served by Spring Boot
- PostgreSQL database with proper schema (boolean fix applied)
- User authentication with session management
- Memory CRUD operations with complete API endpoints
- Frontend build pipeline integrated with Spring Boot
- Database schema fixes applied successfully
- Application fully functional and tested

✅ **Working Features:**
- Spring Boot application serving React frontend at http://localhost:5000
- User registration and login API endpoints
- Memory creation and display functionality
- Dashboard with memory management
- Navigation between pages
- Session-based authentication
- Database integration with PostgreSQL
- Frontend build process with Vite
- CORS configuration for cross-origin requests

## Project Structure

```
├── src/main/java/com/echo/          # Spring Boot application
│   ├── controller/                  # REST API controllers
│   ├── model/                      # JPA entities
│   ├── repository/                 # Data access layer
│   ├── service/                    # Business logic
│   └── config/                     # Configuration classes
├── src/main/resources/
│   ├── static/                     # Built React frontend
│   ├── templates/                  # Thymeleaf templates (if needed)
│   └── application.yml             # Spring Boot configuration
├── frontend/                       # React TypeScript frontend
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   ├── pages/                  # Page components
│   │   └── services/               # API service layer
│   ├── vite.config.ts              # Vite configuration
│   └── package.json                # Frontend dependencies
└── pom.xml                         # Maven configuration
```

## Recent Changes

**2025-08-03:**
- Created complete Java Spring Boot + React TypeScript application
- Fixed database schema issues (boolean column type)
- Implemented session-based authentication
- Built React frontend with Vite and integrated with Spring Boot
- Configured CORS and API endpoints
- Successfully tested backend API responses

## User Preferences

- **Technology Stack**: Java Spring Boot + React TypeScript + PostgreSQL
- **Architecture**: Full-stack with separate frontend/backend
- **Authentication**: Session-based (not JWT tokens)
- **Build Tool**: Maven for backend, Vite for frontend
- **Deployment**: Single Spring Boot application serving both API and frontend

## Next Steps

- Add audio processing features
- Implement geolocation-based memory discovery
- Add memory sharing and social features
- Enhance UI/UX with better styling
- Add real-time features with WebSocket
- Deploy to production