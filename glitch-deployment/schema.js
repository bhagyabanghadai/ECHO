import { pgTable, text, timestamp, uuid, real, integer, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Memories table
export const memories = pgTable('memories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  emotion: text('emotion').notNull(),
  intensity: real('intensity').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  location: text('location'),
  isPublic: boolean('is_public').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Memory unlocks table
export const memoryUnlocks = pgTable('memory_unlocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  memoryId: uuid('memory_id').references(() => memories.id).notNull(),
  unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
});

// Emotion profiles table
export const emotionProfiles = pgTable('emotion_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  dominantEmotion: text('dominant_emotion').notNull(),
  emotionScores: text('emotion_scores').notNull(), // JSON string
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

// Waitlist users table
export const waitlistUsers = pgTable('waitlist_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  name: text('name'),
  interests: text('interests'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertMemorySchema = createInsertSchema(memories);
export const insertMemoryUnlockSchema = createInsertSchema(memoryUnlocks);
export const insertEmotionProfileSchema = createInsertSchema(emotionProfiles);
export const insertWaitlistUserSchema = createInsertSchema(waitlistUsers);