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
  getEmotionMapData(): Promise<{ emotion: string; count: number; lat: number; lng: number }[]>;
  
  // User profile operations
  updateUserProfile(userId: string, profileData: any): Promise<void>;
  deleteMemory(memoryId: string, userId: string): Promise<void>;
  updateMemory(memoryId: string, userId: string, updateData: any): Promise<Memory>;
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
  async getEmotionMapData(): Promise<{ emotion: string; count: number; lat: number; lng: number }[]> {
    // Return sample data for demo purposes with proper field names
    return [
      { emotion: "nostalgia", count: 8, lat: 35.6597, lng: 139.7006 },    // Tokyo
      { emotion: "peace", count: 12, lat: 51.5074, lng: -0.1278 },        // London  
      { emotion: "love", count: 15, lat: 40.7829, lng: -73.9654 },        // New York
      { emotion: "joy", count: 6, lat: -33.8568, lng: 151.2153 },         // Sydney
      { emotion: "warmth", count: 9, lat: 48.8566, lng: 2.2936 },         // Paris
      { emotion: "contemplative", count: 4, lat: 34.0522, lng: -118.2437 }, // Los Angeles
      { emotion: "grateful", count: 7, lat: 55.7558, lng: 37.6176 },      // Moscow
      { emotion: "calm", count: 5, lat: 19.4326, lng: -99.1332 },         // Mexico City
      { emotion: "hopeful", count: 11, lat: -23.5505, lng: -46.6333 },    // São Paulo
      { emotion: "excitement", count: 13, lat: 1.3521, lng: 103.8198 }     // Singapore
    ];
  }
  
  // User profile operations
  async updateUserProfile(userId: string, profileData: any): Promise<void> {
    await db
      .update(users)
      .set({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        // Note: bio, location, website would need to be added to schema
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async deleteMemory(memoryId: string, userId: string): Promise<void> {
    await db
      .delete(memories)
      .where(eq(memories.id, memoryId) && eq(memories.userId, userId));
  }

  async updateMemory(memoryId: string, userId: string, updateData: any): Promise<Memory> {
    const [memory] = await db
      .update(memories)
      .set({
        title: updateData.title,
        description: updateData.description,
        emotion: updateData.emotion,
        isPrivate: updateData.isPrivate,
        updatedAt: new Date()
      })
      .where(eq(memories.id, memoryId) && eq(memories.userId, userId))
      .returning();
    
    return memory;
  }
}

export const storage = new DatabaseStorage();