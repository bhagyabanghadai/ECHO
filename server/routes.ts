import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMemorySchema, insertMemoryUnlockSchema } from "@shared/schema";
import { glmService } from "./glm-service";
import { z } from "zod";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { config } from "./config";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware with PostgreSQL store
  const pgStore = connectPg(session);
  app.use(session({
    store: new pgStore({
      conString: config.DATABASE_URL,
      createTableIfMissing: false, // We already created the table
      tableName: 'sessions'
    }),
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Authentication middleware
  const requireAuth = async (req: any, res: any, next: any) => {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  };

  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const newUser = await storage.createUser(userData);
      
      // Set session
      (req.session as any).userId = newUser.id;
      
      // Don't return password
      const { password, ...userWithoutPassword } = newUser;
      res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const user = await storage.validateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      (req.session as any).userId = user.id;
      
      // Don't return password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Failed to log in" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });
  
  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get global emotion map data (public)
  app.get("/api/emotions/map", async (req, res) => {
    try {
      const emotionMap = await storage.getEmotionMapData();
      res.json({ data: emotionMap });
    } catch (error) {
      console.error("Error getting emotion map:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Memory routes (protected)
  app.get("/api/memories/location", requireAuth, async (req, res) => {
    try {
      const { lat, lng, radius = 10 } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      const memories = await storage.getMemoriesNearLocation(
        parseFloat(lat as string),
        parseFloat(lng as string),
        parseFloat(radius as string)
      );
      
      res.json({ memories });
    } catch (error) {
      console.error("Error getting memories by location:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/memories/user", requireAuth, async (req: any, res) => {
    try {
      const memories = await storage.getUserMemories(req.user.id);
      res.json({ memories });
    } catch (error) {
      console.error("Error getting user memories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/memories", requireAuth, async (req: any, res) => {
    try {
      const memoryData = insertMemorySchema.parse(req.body);
      const memory = await storage.createMemory({
        ...memoryData,
        userId: req.user.id
      });
      res.json({ memory });
    } catch (error) {
      console.error("Error creating memory:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/memories/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const memory = await storage.getMemoryById(id);
      
      if (!memory) {
        return res.status(404).json({ message: "Memory not found" });
      }
      
      res.json({ memory });
    } catch (error) {
      console.error("Error getting memory:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/memories/:id/unlock", requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const unlockData = insertMemoryUnlockSchema.parse(req.body);
      
      const unlock = await storage.unlockMemory({
        ...unlockData,
        memoryId: id,
        unlockedBy: req.user.id
      });
      
      res.json({ unlock });
    } catch (error) {
      console.error("Error unlocking memory:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/memories/:id/unlocks", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const unlocks = await storage.getMemoryUnlocks(id);
      res.json({ unlocks });
    } catch (error) {
      console.error("Error getting memory unlocks:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Memory management endpoints
  app.post("/api/memories", async (req, res) => {
    try {
      const sessionData = req.session as any;
      if (!sessionData.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const memoryData = req.body;
      const result = await storage.createMemory({
        ...memoryData,
        userId: sessionData.userId,
      });
      
      res.json({ success: true, data: result });
    } catch (error) {
      console.error("Error creating memory:", error);
      res.status(500).json({ message: "Failed to create memory" });
    }
  });

  app.get("/api/memories/nearby/:lat/:lng", async (req, res) => {
    try {
      const { lat, lng } = req.params;
      const { radius = 5000 } = req.query; // radius in meters
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude required" });
      }

      const memories = await storage.getMemoriesNearLocation(
        parseFloat(lat),
        parseFloat(lng),
        parseInt(radius as string)
      );
      
      res.json({ data: memories });
    } catch (error) {
      console.error("Error fetching nearby memories:", error);
      res.status(500).json({ message: "Failed to fetch nearby memories" });
    }
  });

  app.get("/api/memories/nearby", async (req, res) => {
    try {
      const sessionData = req.session as any;
      if (!sessionData.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { lat, lng, radius = 5000 } = req.query; // radius in meters
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude required" });
      }

      const memories = await storage.getMemoriesNearLocation(
        parseFloat(lat as string),
        parseFloat(lng as string),
        parseInt(radius as string)
      );
      
      res.json({ data: memories });
    } catch (error) {
      console.error("Error fetching nearby memories:", error);
      res.status(500).json({ message: "Failed to fetch nearby memories" });
    }
  });

  // User profile and stats endpoints (protected)
  app.get("/api/user/profile", requireAuth, async (req: any, res) => {
    try {
      const user = req.user;
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        createdAt: user.createdAt
      });
    } catch (error) {
      console.error("Error getting profile:", error);
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  app.put("/api/user/profile", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const updateData = req.body;
      
      // Update user profile (implement in storage)
      await storage.updateUserProfile(userId, updateData);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.get("/api/user/stats", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Get user statistics
      const memories = await storage.getUserMemories(userId);
      const stats = {
        totalMemories: memories.length,
        totalEchoes: 0, // Implement when echo feature is added
        memoriesUnlocked: 0, // Implement when unlock tracking is added
        favoriteEmotion: memories.length > 0 ? memories[0].emotion : 'contemplative',
        joinedDate: req.user.createdAt
      };
      
      res.json({ data: stats });
    } catch (error) {
      console.error("Error getting user stats:", error);
      res.status(500).json({ message: "Failed to get user stats" });
    }
  });

  // Enhanced memories endpoints for logged-in users
  app.get("/api/memories/user", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const memories = await storage.getUserMemories(userId);
      res.json({ memories });
    } catch (error) {
      console.error("Error getting user memories:", error);
      res.status(500).json({ message: "Failed to get memories" });
    }
  });

  app.delete("/api/memories/:id", requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Verify ownership and delete (implement in storage)
      await storage.deleteMemory(id, userId);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting memory:", error);
      res.status(500).json({ message: "Failed to delete memory" });
    }
  });

  app.put("/api/memories/:id", requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;
      
      // Verify ownership and update (implement in storage)
      const memory = await storage.updateMemory(id, userId, updateData);
      
      res.json({ memory });
    } catch (error) {
      console.error("Error updating memory:", error);
      res.status(500).json({ message: "Failed to update memory" });
    }
  });

  // GLM AI Emotion Analysis endpoints
  app.post("/api/ai/analyze-emotion", async (req, res) => {
    try {
      const { text, context } = req.body;
      
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ message: "Text is required for analysis" });
      }

      const analysis = await glmService.analyzeEmotion(text);
      res.json({ analysis });
    } catch (error) {
      console.error("Error analyzing emotion:", error);
      res.status(500).json({ message: "Failed to analyze emotion", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post("/api/ai/analyze-voice", async (req, res) => {
    try {
      const { transcript, context } = req.body;
      
      if (!transcript || typeof transcript !== 'string') {
        return res.status(400).json({ message: "Voice transcript is required for analysis" });
      }

      const analysis = await glmService.analyzeVoiceTranscript(transcript, context);
      res.json({ analysis });
    } catch (error) {
      console.error("Error analyzing voice emotion:", error);
      res.status(500).json({ message: "Failed to analyze voice emotion", error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}