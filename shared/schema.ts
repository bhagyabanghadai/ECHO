import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  hasCompletedOnboarding: integer("has_completed_onboarding").default(0), // 0 = false, 1 = true
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const memories = pgTable("memories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(), // Memory title
  description: text("description"), // Optional description
  content: text("content"), // Voice transcript or text content
  audioData: text("audio_data"), // Base64 encoded audio data
  audioUrl: text("audio_url"), // URL to audio file
  emotion: text("emotion").notNull(), // AI-detected emotion
  emotionConfidence: real("emotion_confidence").default(0),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  locationName: text("location_name"),
  duration: integer("duration").default(0), // Audio duration in seconds
  accessType: text("access_type").notNull().default("public"), // public, friends, emotion_match, private
  isActive: integer("is_active").default(1), // 1 = sleeping, 2 = unlocked
  unlockCount: integer("unlock_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const memoryUnlocks = pgTable("memory_unlocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memoryId: varchar("memory_id").notNull().references(() => memories.id),
  unlockedBy: varchar("unlocked_by").notNull().references(() => users.id),
  echoContent: text("echo_content"), // Response/echo content
  echoAudioUrl: text("echo_audio_url"),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const emotionProfiles = pgTable("emotion_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  emotionData: jsonb("emotion_data").notNull(), // Stores emotion analysis data
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const waitlistUsers = pgTable("waitlist_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  source: text("source").default("landing_page"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  avatar: true,
  bio: true,
});

export const insertMemorySchema = createInsertSchema(memories).pick({
  title: true,
  description: true,
  content: true,
  audioData: true,
  audioUrl: true,
  emotion: true,
  emotionConfidence: true,
  latitude: true,
  longitude: true,
  locationName: true,
  duration: true,
  accessType: true,
  isActive: true,
});

export const insertMemoryUnlockSchema = createInsertSchema(memoryUnlocks).pick({
  memoryId: true,
  echoContent: true,
  echoAudioUrl: true,
});

export const insertWaitlistUserSchema = createInsertSchema(waitlistUsers).pick({
  email: true,
  source: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type Memory = typeof memories.$inferSelect;
export type InsertMemoryUnlock = z.infer<typeof insertMemoryUnlockSchema>;
export type MemoryUnlock = typeof memoryUnlocks.$inferSelect;
export type InsertWaitlistUser = z.infer<typeof insertWaitlistUserSchema>;
export type WaitlistUser = typeof waitlistUsers.$inferSelect;
export type EmotionProfile = typeof emotionProfiles.$inferSelect;
