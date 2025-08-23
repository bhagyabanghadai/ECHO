import { eq, and, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from './db.js';
import { users, memories, memoryUnlocks, emotionProfiles } from './schema.js';

export class DatabaseStorage {
  // User operations
  async getUser(email) {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const result = await db.insert(users).values({
        email: userData.email,
        password: hashedPassword,
        name: userData.name
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async validatePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error validating password:', error);
      return false;
    }
  }

  // Memory operations
  async createMemory(memoryData) {
    try {
      const result = await db.insert(memories).values(memoryData).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating memory:', error);
      throw error;
    }
  }

  async getMemoriesNearLocation(latitude, longitude, radiusKm = 10, limit = 50) {
    try {
      const result = await db.execute(sql`
        SELECT m.*, u.name as user_name
        FROM ${memories} m
        JOIN ${users} u ON m.user_id = u.id
        WHERE m.is_public = true
        AND (
          6371 * acos(
            cos(radians(${latitude})) * cos(radians(m.latitude)) *
            cos(radians(m.longitude) - radians(${longitude})) +
            sin(radians(${latitude})) * sin(radians(m.latitude))
          )
        ) <= ${radiusKm}
        ORDER BY (
          6371 * acos(
            cos(radians(${latitude})) * cos(radians(m.latitude)) *
            cos(radians(m.longitude) - radians(${longitude})) +
            sin(radians(${latitude})) * sin(radians(m.latitude))
          )
        ) ASC
        LIMIT ${limit}
      `);
      return result.rows || [];
    } catch (error) {
      console.error('Error getting memories near location:', error);
      return [];
    }
  }

  async getUserMemories(userId) {
    try {
      const result = await db.select().from(memories)
        .where(eq(memories.userId, userId))
        .orderBy(sql`${memories.createdAt} DESC`);
      return result;
    } catch (error) {
      console.error('Error getting user memories:', error);
      throw error;
    }
  }

  async getMemoryById(memoryId) {
    try {
      const result = await db.select().from(memories).where(eq(memories.id, memoryId)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error('Error getting memory by ID:', error);
      throw error;
    }
  }

  // Memory unlock operations
  async unlockMemory(userId, memoryId) {
    try {
      const result = await db.insert(memoryUnlocks).values({
        userId,
        memoryId
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Error unlocking memory:', error);
      throw error;
    }
  }

  async getMemoryUnlocks(userId) {
    try {
      const result = await db.select().from(memoryUnlocks).where(eq(memoryUnlocks.userId, userId));
      return result;
    } catch (error) {
      console.error('Error getting memory unlocks:', error);
      throw error;
    }
  }

  // Sample emotion map data
  async getEmotionMapData() {
    try {
      // Return sample data for demonstration
      return [
        {
          id: '1',
          latitude: 40.7128,
          longitude: -74.0060,
          emotion: 'joy',
          intensity: 0.8,
          title: 'Amazing day in NYC',
          location: 'New York City, NY',
          user_name: 'Anonymous'
        },
        {
          id: '2',
          latitude: 34.0522,
          longitude: -118.2437,
          emotion: 'excitement',
          intensity: 0.9,
          title: 'Hollywood adventure',
          location: 'Los Angeles, CA',
          user_name: 'Anonymous'
        },
        {
          id: '3',
          latitude: 41.8781,
          longitude: -87.6298,
          emotion: 'nostalgia',
          intensity: 0.7,
          title: 'Childhood memories',
          location: 'Chicago, IL',
          user_name: 'Anonymous'
        }
      ];
    } catch (error) {
      console.error('Error getting emotion map data:', error);
      return [];
    }
  }

  // User profile operations
  async updateUserProfile(userId, profileData) {
    try {
      const result = await db.update(users)
        .set({ ...profileData, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async deleteMemory(memoryId, userId) {
    try {
      const result = await db.delete(memories)
        .where(and(eq(memories.id, memoryId), eq(memories.userId, userId)))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error deleting memory:', error);
      throw error;
    }
  }

  async updateMemory(memoryId, userId, updateData) {
    try {
      const result = await db.update(memories)
        .set({ ...updateData, updatedAt: new Date() })
        .where(and(eq(memories.id, memoryId), eq(memories.userId, userId)))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Error updating memory:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();