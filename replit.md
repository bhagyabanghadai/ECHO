# ECHO - Emotional Memory Social Network

## Overview

ECHO is a modern web application that serves as an AI-powered emotional memory social network. The application allows users to create voice-based memories tied to specific locations and emotions, which can then be discovered and "echoed" by other users. Built with a modern tech stack, ECHO combines React frontend, Express.js backend, and PostgreSQL database with Drizzle ORM.

## MVP Features Implemented

The core MVP focuses on 3 high-impact features that create magical first-minute experiences:

1. **✅ GPS-Based Unlock**: Users can discover emotional memories hidden in their physical location. The app uses geolocation to surface memories within a specific radius, creating location-aware storytelling.

2. **✅ Real-Time Voice Posting**: Users can record voice memories that are instantly analyzed for emotional content. The app simulates AI emotion detection (joy, nostalgia, calm, etc.) and immediately processes recordings into shareable memories.

3. **✅ Emotion-Aware Welcome**: New users experience a guided demo that showcases all three features in an interactive flow. The system demonstrates location discovery, voice recording with emotion analysis, and memory unlocking in a cohesive onboarding experience.

## Recent Changes (August 22, 2025)

- Implemented authentication modal windows with tabbed login/signup interface
- Created MVP demo component showcasing the 3 core features
- Added GPS-based memory discovery with distance calculations  
- Built real-time voice recording simulation with emotion detection
- Integrated location-aware memory unlocking system
- Added database schema support for memories, unlocks, and geolocation data
- **Google Maps Integration**: Implemented interactive Google Maps global emotion map with:
  - Crystal clear native Google Maps styling (removed dark custom themes)
  - Hide/show toggle for emotion panel with improved UX
  - Real-time emotion data from 10 major world cities (Tokyo, London, NYC, Paris, etc.)
  - Map type controls (Roadmap, Satellite, Hybrid, Terrain)
  - Enhanced coordinate validation and error handling
- **GLM-4.5 AI Integration**: Replaced simulated emotion detection with real AI:
  - GLM API service for authentic emotion analysis
  - Real-time voice transcript emotion analysis 
  - AI-powered confidence scoring and multi-emotion detection
  - Fallback handling for reliable user experience
  - API endpoints: `/api/ai/analyze-emotion` and `/api/ai/analyze-voice`

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack architecture with clear separation between frontend and backend concerns:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom ECHO brand colors and dark theme
- **State Management**: TanStack Query for server state management
- **Animations**: Framer Motion for smooth animations and transitions
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Session Management**: Built-in session handling for user authentication
- **Development**: Hot module replacement with Vite integration

## Key Components

### Frontend Components
1. **Landing Page**: Immersive hero section with interactive globe visualization
2. **Voice Recorder**: Real-time voice recording with emotion detection simulation
3. **Emotion Map**: Interactive visualization of global emotion data
4. **Memory Cards**: Display of memory content with voice playback
5. **Custom Cursor**: Enhanced user interaction feedback
6. **Navigation**: Smooth scrolling navigation with glass morphism effects

### Backend Services
1. **Memory Management**: CRUD operations for voice memories with location data
2. **Emotion Analysis**: Integration points for AI-powered emotion detection
3. **Waitlist System**: Email collection for early access users
4. **Location Services**: Geographic data handling for memory placement
5. **User Management**: Authentication and profile management

### Database Schema
The application uses PostgreSQL with the following main entities:
- **Users**: User profiles with authentication data
- **Memories**: Voice memories with emotion, location, and access control
- **Memory Unlocks**: Tracking when users discover and interact with memories
- **Emotion Profiles**: AI-generated emotional analysis data
- **Waitlist Users**: Pre-launch user registration

## Data Flow

1. **Memory Creation**: Users record voice messages which are processed for emotion detection and stored with location data
2. **Discovery**: Memories are surfaced to users based on proximity, emotion matching, or social connections
3. **Interaction**: Users can "echo" (respond to) memories, creating threaded conversations
4. **Analytics**: Emotion data is aggregated for insights and the global emotion map

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Animations**: Framer Motion for smooth transitions
- **Voice Recording**: Web Audio API for microphone access
- **Location Services**: Browser Geolocation API

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL
- **Session Storage**: PostgreSQL-based session storage
- **Development Tools**: TSX for TypeScript execution, ESBuild for production builds

### Development Tools
- **Package Manager**: npm with lockfile version 3
- **Type Checking**: TypeScript with strict configuration
- **Code Quality**: Tailwind CSS for consistent styling
- **Build Process**: Vite for frontend, ESBuild for backend bundling

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Mode
- Frontend served by Vite dev server with HMR
- Backend runs with tsx for TypeScript execution
- Database migrations managed by Drizzle Kit
- Environment variables for database connection

### Production Build
- Frontend built to static assets with Vite
- Backend bundled with ESBuild for Node.js
- Single server serves both API and static files
- Database schema deployed via Drizzle migrations

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Build Assets**: Static files served from dist/public directory
- **API Routes**: RESTful endpoints under /api prefix
- **Development**: Replit-specific tooling and error overlays

The application demonstrates modern web development practices with TypeScript throughout, comprehensive UI component library, and scalable database architecture ready for the emotional memory social network concept.