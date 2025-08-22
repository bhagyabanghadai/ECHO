# Environment Variables Setup Guide

This guide explains how to set up all the required environment variables for the ECHO project.

## Required Environment Variables

### 1. Database Configuration

#### `DATABASE_URL`
- **Purpose**: PostgreSQL database connection string for Neon serverless database
- **Format**: `postgresql://username:password@hostname:port/database_name`
- **How to get**: 
  1. Sign up at [Neon](https://neon.tech/)
  2. Create a new project
  3. Copy the connection string from your dashboard
- **Example**: `postgresql://user:pass@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb`

#### Individual PostgreSQL Parameters (Optional)
- `PGDATABASE`: Database name
- `PGHOST`: Database host
- `PGPASSWORD`: Database password
- `PGPORT`: Database port (usually 5432)
- `PGUSER`: Database username

### 2. AI Service Configuration

#### `GLM_API_KEY`
- **Purpose**: GLM-4.5 AI API key for real-time emotion analysis
- **How to get**:
  1. Visit [GLM API Platform](https://open.bigmodel.cn/)
  2. Register for an account
  3. Create an API key in your dashboard
- **Note**: Currently experiencing rate limits (429 errors), but system has fallback
- **Fallback**: Improved keyword-based emotion detection when API is unavailable

### 3. Google Maps Configuration

#### `VITE_GOOGLE_MAPS_API_KEY`
- **Purpose**: Google Maps JavaScript API key for interactive emotion map
- **How to get**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project or select existing one
  3. Enable the Maps JavaScript API
  4. Create credentials (API Key)
  5. Restrict the key to Maps JavaScript API for security
- **Required APIs**: Maps JavaScript API, Places API, Geometry API

### 4. Session Management

#### `SESSION_SECRET`
- **Purpose**: Secret key for encrypting user sessions
- **How to generate**: Use a secure random string generator
- **Example generation**:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Security**: Keep this secret and never commit to version control

### 5. Server Configuration

#### `PORT`
- **Purpose**: Port for the application server
- **Default**: 5000
- **Note**: Other ports may be firewalled in production

#### `NODE_ENV`
- **Purpose**: Environment mode (development/production)
- **Values**: `development` or `production`
- **Default**: `development`

## Setup Instructions

### 1. Copy Environment Template
```bash
cp .env.example .env
```

### 2. Fill in Your Values
Edit the `.env` file and replace all placeholder values with your actual credentials:

```env
# Database
DATABASE_URL=your_actual_neon_connection_string

# AI Service
GLM_API_KEY=your_actual_glm_api_key

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key

# Session
SESSION_SECRET=your_generated_secret_key

# Server
PORT=5000
NODE_ENV=development
```

### 3. Verify Setup
Run the application to verify all environment variables are loaded correctly:

```bash
npm run dev
```

## Current Implementation Status

### ✅ Working Features
- **Database Connection**: PostgreSQL with Neon serverless
- **Google Maps Integration**: Interactive emotion map with real-time data
- **Session Management**: Secure user authentication
- **Fallback Systems**: Keyword-based emotion detection when AI API is unavailable

### ⚠️ Known Issues
- **GLM API Rate Limiting**: Currently hitting 429 errors, but fallback system handles this gracefully
- **Development vs Production**: Some configurations may need adjustment for production deployment

### 🔧 Environment Variable Usage in Code

#### Server-side (Node.js)
- `process.env.DATABASE_URL` - Database connection
- `process.env.GLM_API_KEY` - AI emotion analysis
- `process.env.SESSION_SECRET` - Session encryption
- `process.env.PORT` - Server port

#### Client-side (Vite/React)
- `import.meta.env.VITE_GOOGLE_MAPS_API_KEY` - Google Maps integration

## Security Best Practices

1. **Never commit `.env` files** - Already added to `.gitignore`
2. **Use different keys for development and production**
3. **Regularly rotate API keys**
4. **Restrict API keys to specific domains/IPs in production**
5. **Use environment-specific configurations**

## Troubleshooting

### Database Connection Issues
- Verify your Neon database is active
- Check connection string format
- Ensure database exists and is accessible

### Google Maps Not Loading
- Verify API key is correct
- Check that Maps JavaScript API is enabled
- Ensure API key restrictions allow your domain

### GLM API Rate Limits
- This is expected - the system will use fallback emotion detection
- Monitor your API usage in the GLM dashboard
- Consider upgrading your plan if needed

### Session Issues
- Ensure `SESSION_SECRET` is set
- Check that sessions table exists in database
- Verify PostgreSQL connection for session storage

## Need Help?

If you encounter issues:
1. Check the console for specific error messages
2. Verify all required environment variables are set
3. Test each service individually
4. Check API service status pages for outages