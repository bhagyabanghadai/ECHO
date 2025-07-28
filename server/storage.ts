import { 
  users, 
  memories, 
  memoryUnlocks, 
  type User, 
  type InsertUser, 
  type Memory, 
  type InsertMemory,
  type MemoryUnlock,
  type InsertMemoryUnlock
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  validateUser(email: string, password: string): Promise<User | null>;
  
  // Memory operations
  createMemory(insertMemory: InsertMemory & { userId: string }): Promise<Memory>;
  getMemoriesNearLocation(lat: number, lng: number, radius: number): Promise<Memory[]>;
  getUserMemories(userId: string): Promise<Memory[]>;
  getMemoryById(id: string): Promise<Memory | undefined>;
  
  // Memory unlock operations
  unlockMemory(insertUnlock: InsertMemoryUnlock & { unlockedBy: string }): Promise<MemoryUnlock>;
  getMemoryUnlocks(memoryId: string): Promise<MemoryUnlock[]>;
  
  // Emotion operations
  getEmotionMapData(): Promise<{ emotion: string; count: number; avgLat: number; avgLng: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Memory operations
  async createMemory(insertMemory: InsertMemory & { userId: string }): Promise<Memory> {
    const [memory] = await db
      .insert(memories)
      .values(insertMemory)
      .returning();
    return memory;
  }

  async getMemoriesNearLocation(lat: number, lng: number, radius: number): Promise<Memory[]> {
    // For now, return all memories. In production, implement proper geospatial queries
    return await db.select().from(memories);
  }

  async getUserMemories(userId: string): Promise<Memory[]> {
    return await db.select().from(memories).where(eq(memories.userId, userId));
  }

  async getMemoryById(id: string): Promise<Memory | undefined> {
    const [memory] = await db.select().from(memories).where(eq(memories.id, id));
    return memory;
  }

  // Memory unlock operations
  async unlockMemory(insertUnlock: InsertMemoryUnlock & { unlockedBy: string }): Promise<MemoryUnlock> {
    const [unlock] = await db
      .insert(memoryUnlocks)
      .values(insertUnlock)
      .returning();
    return unlock;
  }

  async getMemoryUnlocks(memoryId: string): Promise<MemoryUnlock[]> {
    return await db.select().from(memoryUnlocks).where(eq(memoryUnlocks.memoryId, memoryId));
  }

  // Emotion operations with sample data for demo
  async getEmotionMapData(): Promise<{ emotion: string; count: number; avgLat: number; avgLng: number }[]> {
    // Return sample data for demo purposes
    return [
      { emotion: "nostalgia", count: 1, avgLat: 35.6597, avgLng: 139.7006 },
      { emotion: "peace", count: 1, avgLat: 51.5074, avgLng: -0.1278 },
      { emotion: "love", count: 1, avgLat: 40.7829, avgLng: -73.9654 },
      { emotion: "joy", count: 1, avgLat: -33.8568, avgLng: 151.2153 },
      { emotion: "warmth", count: 1, avgLat: 48.8566, avgLng: 2.2936 }
    ];
  }
}

export const storage = new DatabaseStorage();