import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Export environment variables for use throughout the application
export const config = {
  DATABASE_URL: process.env.DATABASE_URL,
  GLM_API_KEY: process.env.GLM_API_KEY,
  SESSION_SECRET: process.env.SESSION_SECRET || 'echo-dev-secret-key',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  VITE_GOOGLE_MAPS_API_KEY: process.env.VITE_GOOGLE_MAPS_API_KEY,
};