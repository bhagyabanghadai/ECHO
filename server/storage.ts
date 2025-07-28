import { type User, type InsertUser, type Memory, type InsertMemory, type MemoryUnlock, type InsertMemoryUnlock, type WaitlistUser, type InsertWaitlistUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Memory operations
  getMemory(id: string): Promise<Memory | undefined>;
  getMemoriesByLocation(lat: number, lng: number, radius: number): Promise<Memory[]>;
  getMemoriesByUser(userId: string): Promise<Memory[]>;
  getMemoriesByEmotion(emotion: string): Promise<Memory[]>;
  createMemory(memory: InsertMemory & { userId: string }): Promise<Memory>;
  updateMemoryStatus(id: string, status: number): Promise<void>;
  incrementMemoryUnlocks(id: string): Promise<void>;

  // Memory unlock operations
  getMemoryUnlocks(memoryId: string): Promise<MemoryUnlock[]>;
  createMemoryUnlock(unlock: InsertMemoryUnlock & { unlockedBy: string }): Promise<MemoryUnlock>;
  getUserUnlocks(userId: string): Promise<MemoryUnlock[]>;

  // Waitlist operations
  addToWaitlist(user: InsertWaitlistUser): Promise<WaitlistUser>;
  getWaitlistUser(email: string): Promise<WaitlistUser | undefined>;
  getWaitlistCount(): Promise<number>;

  // Analytics
  getGlobalEmotionMap(): Promise<{ emotion: string; count: number; lat: number; lng: number; locationName: string }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private memories: Map<string, Memory>;
  private memoryUnlocks: Map<string, MemoryUnlock>;
  private waitlistUsers: Map<string, WaitlistUser>;

  constructor() {
    this.users = new Map();
    this.memories = new Map();
    this.memoryUnlocks = new Map();
    this.waitlistUsers = new Map();
    
    // Initialize with some sample data for the demo
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample memories for the global emotion map
    const sampleMemories = [
      {
        id: randomUUID(),
        userId: "sample-user-1",
        content: "Missing the cherry blossoms in Shibuya...",
        audioUrl: null,
        emotion: "nostalgia",
        emotionConfidence: 0.89,
        latitude: 35.6597,
        longitude: 139.7006,
        locationName: "Shibuya, Tokyo",
        accessType: "public",
        isActive: 1,
        unlockCount: 3,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: randomUUID(),
        userId: "sample-user-2",
        content: "Found peace by the Thames today",
        audioUrl: null,
        emotion: "peace",
        emotionConfidence: 0.92,
        latitude: 51.5074,
        longitude: -0.1278,
        locationName: "London, UK",
        accessType: "public",
        isActive: 1,
        unlockCount: 1,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        id: randomUUID(),
        userId: "sample-user-3",
        content: "Love overflowing in Central Park",
        audioUrl: null,
        emotion: "love",
        emotionConfidence: 0.95,
        latitude: 40.7829,
        longitude: -73.9654,
        locationName: "Central Park, NYC",
        accessType: "public",
        isActive: 1,
        unlockCount: 7,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        id: randomUUID(),
        userId: "sample-user-4",
        content: "Pure joy watching the sunrise at the Opera House",
        audioUrl: null,
        emotion: "joy",
        emotionConfidence: 0.87,
        latitude: -33.8568,
        longitude: 151.2153,
        locationName: "Sydney, Australia",
        accessType: "public",
        isActive: 1,
        unlockCount: 2,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        id: randomUUID(),
        userId: "sample-user-5",
        content: "Warmth of love near the Eiffel Tower",
        audioUrl: null,
        emotion: "warmth",
        emotionConfidence: 0.91,
        latitude: 48.8566,
        longitude: 2.2936,
        locationName: "Paris, France",
        accessType: "public",
        isActive: 1,
        unlockCount: 4,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      }
    ];

    sampleMemories.forEach(memory => {
      this.memories.set(memory.id, memory as Memory);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getMemory(id: string): Promise<Memory | undefined> {
    return this.memories.get(id);
  }

  async getMemoriesByLocation(lat: number, lng: number, radius: number): Promise<Memory[]> {
    const memories = Array.from(this.memories.values());
    return memories.filter(memory => {
      const distance = this.calculateDistance(lat, lng, memory.latitude, memory.longitude);
      return distance <= radius;
    });
  }

  async getMemoriesByUser(userId: string): Promise<Memory[]> {
    return Array.from(this.memories.values()).filter(memory => memory.userId === userId);
  }

  async getMemoriesByEmotion(emotion: string): Promise<Memory[]> {
    return Array.from(this.memories.values()).filter(memory => memory.emotion === emotion);
  }

  async createMemory(memoryData: InsertMemory & { userId: string }): Promise<Memory> {
    const id = randomUUID();
    const memory: Memory = {
      ...memoryData,
      id,
      isActive: 1,
      unlockCount: 0,
      createdAt: new Date(),
    };
    this.memories.set(id, memory);
    return memory;
  }

  async updateMemoryStatus(id: string, status: number): Promise<void> {
    const memory = this.memories.get(id);
    if (memory) {
      memory.isActive = status;
      this.memories.set(id, memory);
    }
  }

  async incrementMemoryUnlocks(id: string): Promise<void> {
    const memory = this.memories.get(id);
    if (memory) {
      memory.unlockCount += 1;
      this.memories.set(id, memory);
    }
  }

  async getMemoryUnlocks(memoryId: string): Promise<MemoryUnlock[]> {
    return Array.from(this.memoryUnlocks.values()).filter(unlock => unlock.memoryId === memoryId);
  }

  async createMemoryUnlock(unlockData: InsertMemoryUnlock & { unlockedBy: string }): Promise<MemoryUnlock> {
    const id = randomUUID();
    const unlock: MemoryUnlock = {
      ...unlockData,
      id,
      unlockedAt: new Date(),
    };
    this.memoryUnlocks.set(id, unlock);
    await this.incrementMemoryUnlocks(unlockData.memoryId);
    return unlock;
  }

  async getUserUnlocks(userId: string): Promise<MemoryUnlock[]> {
    return Array.from(this.memoryUnlocks.values()).filter(unlock => unlock.unlockedBy === userId);
  }

  async addToWaitlist(userData: InsertWaitlistUser): Promise<WaitlistUser> {
    const id = randomUUID();
    const user: WaitlistUser = {
      ...userData,
      id,
      joinedAt: new Date(),
    };
    this.waitlistUsers.set(user.email, user);
    return user;
  }

  async getWaitlistUser(email: string): Promise<WaitlistUser | undefined> {
    return this.waitlistUsers.get(email);
  }

  async getWaitlistCount(): Promise<number> {
    return this.waitlistUsers.size;
  }

  async getGlobalEmotionMap(): Promise<{ emotion: string; count: number; lat: number; lng: number; locationName: string }[]> {
    const memories = Array.from(this.memories.values());
    const emotionMap = new Map<string, { emotion: string; count: number; lat: number; lng: number; locationName: string }>();
    
    memories.forEach(memory => {
      const key = `${memory.latitude},${memory.longitude}`;
      if (emotionMap.has(key)) {
        emotionMap.get(key)!.count += 1;
      } else {
        emotionMap.set(key, {
          emotion: memory.emotion,
          count: 1,
          lat: memory.latitude,
          lng: memory.longitude,
          locationName: memory.locationName || 'Unknown Location'
        });
      }
    });

    return Array.from(emotionMap.values());
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}

export const storage = new MemStorage();
