import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistUserSchema, insertMemorySchema, insertMemoryUnlockSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Waitlist endpoint
  app.post("/api/waitlist", async (req, res) => {
    try {
      const userData = insertWaitlistUserSchema.parse(req.body);
      
      // Check if email already exists
      const existingUser = await storage.getWaitlistUser(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered for waitlist" });
      }

      const user = await storage.addToWaitlist(userData);
      res.json({ message: "Successfully added to waitlist", user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get waitlist count
  app.get("/api/waitlist/count", async (req, res) => {
    try {
      const count = await storage.getWaitlistCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get global emotion map data
  app.get("/api/emotions/map", async (req, res) => {
    try {
      const emotionMap = await storage.getGlobalEmotionMap();
      res.json({ data: emotionMap });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get memories by location
  app.get("/api/memories/location", async (req, res) => {
    try {
      const { lat, lng, radius = 10 } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      const memories = await storage.getMemoriesByLocation(
        parseFloat(lat as string),
        parseFloat(lng as string),
        parseFloat(radius as string)
      );
      
      res.json({ memories });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get memories by emotion
  app.get("/api/memories/emotion/:emotion", async (req, res) => {
    try {
      const { emotion } = req.params;
      const memories = await storage.getMemoriesByEmotion(emotion);
      res.json({ memories });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create a new memory
  app.post("/api/memories", async (req, res) => {
    try {
      const memoryData = insertMemorySchema.extend({
        userId: z.string()
      }).parse(req.body);

      const memory = await storage.createMemory(memoryData);
      res.json({ message: "Memory created successfully", memory });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Unlock a memory
  app.post("/api/memories/:id/unlock", async (req, res) => {
    try {
      const { id } = req.params;
      const unlockData = insertMemoryUnlockSchema.extend({
        unlockedBy: z.string()
      }).parse({ ...req.body, memoryId: id });

      const memory = await storage.getMemory(id);
      if (!memory) {
        return res.status(404).json({ message: "Memory not found" });
      }

      const unlock = await storage.createMemoryUnlock(unlockData);
      res.json({ message: "Memory unlocked successfully", unlock });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get memory unlocks/echoes
  app.get("/api/memories/:id/unlocks", async (req, res) => {
    try {
      const { id } = req.params;
      const unlocks = await storage.getMemoryUnlocks(id);
      res.json({ unlocks });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
