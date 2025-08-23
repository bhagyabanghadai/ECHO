import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Export environment variables for use throughout the application
export const config = {
  DATABASE_URL: process.env.DATABASE_URL,
  GLM_API_KEY: process.env.GLM_API_KEY,
  SESSION_SECRET: process.env.SESSION_SECRET || 'echo-dev-secret-key',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  VITE_GOOGLE_MAPS_API_KEY: process.env.VITE_GOOGLE_MAPS_API_KEY,
};

// Validate required environment variables
if (!config.DATABASE_URL) {
  console.error('❌ DATABASE_URL is required');
  process.exit(1);
}

if (!config.SESSION_SECRET || config.SESSION_SECRET === 'echo-dev-secret-key') {
  console.warn('⚠️  Using default SESSION_SECRET. Please set a secure secret in production.');
}

console.log('✅ Configuration loaded successfully');
console.log(`📍 Environment: ${config.NODE_ENV}`);
console.log(`🔌 Port: ${config.PORT}`);
console.log(`🗄️  Database: ${config.DATABASE_URL ? 'Connected' : 'Not configured'}`);
console.log(`🤖 GLM API: ${config.GLM_API_KEY ? 'Configured' : 'Not configured'}`);
console.log(`🗺️  Google Maps: ${config.VITE_GOOGLE_MAPS_API_KEY ? 'Configured' : 'Not configured'}`);