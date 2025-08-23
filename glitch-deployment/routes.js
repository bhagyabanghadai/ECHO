import { storage } from './storage.js';
import { config } from './config.js';

// GLM API service for emotion analysis
class GLMService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  }

  async analyzeEmotion(text) {
    if (!this.apiKey) {
      return this.fallbackEmotionAnalysis(text);
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'glm-4-flash',
          messages: [
            {
              role: 'system',
              content: 'You are an emotion analysis expert. Analyze the emotional content of text and respond with a JSON object containing "emotion" (one of: joy, sadness, anger, fear, surprise, disgust, trust, anticipation, love, optimism, pessimism, nostalgia, excitement, calm, anxiety, contentment) and "intensity" (0.0 to 1.0). Only respond with valid JSON.'
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        console.warn('GLM API error:', response.status, response.statusText);
        return this.fallbackEmotionAnalysis(text);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (content) {
        try {
          return JSON.parse(content);
        } catch (parseError) {
          console.warn('Failed to parse GLM response:', parseError);
          return this.fallbackEmotionAnalysis(text);
        }
      }
      
      return this.fallbackEmotionAnalysis(text);
    } catch (error) {
      console.warn('GLM API request failed:', error.message);
      return this.fallbackEmotionAnalysis(text);
    }
  }

  fallbackEmotionAnalysis(text) {
    const lowerText = text.toLowerCase();
    
    const emotionKeywords = {
      joy: ['happy', 'joy', 'excited', 'wonderful', 'amazing', 'great', 'fantastic', 'awesome', 'love', 'beautiful'],
      sadness: ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'heartbroken', 'disappointed', 'lonely'],
      anger: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated', 'rage', 'hate'],
      fear: ['scared', 'afraid', 'terrified', 'anxious', 'worried', 'nervous', 'panic', 'frightened'],
      surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'unexpected', 'wow'],
      nostalgia: ['remember', 'memories', 'past', 'childhood', 'miss', 'used to', 'back then'],
      excitement: ['excited', 'thrilled', 'pumped', 'energetic', 'enthusiastic'],
      calm: ['peaceful', 'calm', 'relaxed', 'serene', 'tranquil', 'quiet']
    };

    let bestMatch = { emotion: 'contentment', intensity: 0.5 };
    let maxScore = 0;

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (lowerText.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = {
          emotion,
          intensity: Math.min(0.3 + (score * 0.2), 1.0)
        };
      }
    }

    return bestMatch;
  }
}

const glmService = new GLMService(config.GLM_API_KEY);

export function setupRoutes(app) {
  // Authentication routes
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, name } = req.body;
      
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }

      // Check if user already exists
      const existingUser = await storage.getUser(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create new user
      const user = await storage.createUser({ email, password, name });
      
      // Set session
      req.session.userId = user.id;
      req.session.user = { id: user.id, email: user.email, name: user.name };
      
      res.json({ 
        message: 'User created successfully',
        user: { id: user.id, email: user.email, name: user.name }
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.post('/api/auth/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Get user
      const user = await storage.getUser(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Validate password
      const isValid = await storage.validatePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Set session
      req.session.userId = user.id;
      req.session.user = { id: user.id, email: user.email, name: user.name };
      
      res.json({ 
        message: 'Signed in successfully',
        user: { id: user.id, email: user.email, name: user.name }
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({ error: 'Failed to sign in' });
    }
  });

  app.post('/api/auth/signout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Signout error:', err);
        return res.status(500).json({ error: 'Failed to sign out' });
      }
      res.json({ message: 'Signed out successfully' });
    });
  });

  app.get('/api/auth/me', (req, res) => {
    if (req.session.user) {
      res.json({ user: req.session.user });
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  });

  // Memory routes
  app.post('/api/memories', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { title, content, latitude, longitude, location, isPublic } = req.body;
      
      if (!title || !content || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'Title, content, latitude, and longitude are required' });
      }

      // Analyze emotion
      const emotionAnalysis = await glmService.analyzeEmotion(content);
      
      const memoryData = {
        userId: req.session.userId,
        title,
        content,
        emotion: emotionAnalysis.emotion,
        intensity: emotionAnalysis.intensity,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        location: location || null,
        isPublic: Boolean(isPublic)
      };

      const memory = await storage.createMemory(memoryData);
      res.json({ memory, emotionAnalysis });
    } catch (error) {
      console.error('Create memory error:', error);
      res.status(500).json({ error: 'Failed to create memory' });
    }
  });

  app.get('/api/memories/near', async (req, res) => {
    try {
      const { lat, lng, radius = 10 } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
      }

      const memories = await storage.getMemoriesNearLocation(
        parseFloat(lat),
        parseFloat(lng),
        parseFloat(radius)
      );
      
      res.json({ memories });
    } catch (error) {
      console.error('Get memories near location error:', error);
      res.status(500).json({ error: 'Failed to get memories' });
    }
  });

  app.get('/api/memories/user', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const memories = await storage.getUserMemories(req.session.userId);
      res.json({ memories });
    } catch (error) {
      console.error('Get user memories error:', error);
      res.status(500).json({ error: 'Failed to get memories' });
    }
  });

  // Emotion map route
  app.get('/api/emotion-map', async (req, res) => {
    try {
      const { lat, lng } = req.query;
      
      let memories;
      if (lat && lng) {
        memories = await storage.getMemoriesNearLocation(
          parseFloat(lat),
          parseFloat(lng),
          50 // 50km radius for emotion map
        );
      } else {
        // Return sample data if no location provided
        memories = await storage.getEmotionMapData();
      }
      
      res.json({ emotions: memories });
    } catch (error) {
      console.error('Get emotion map error:', error);
      res.status(500).json({ error: 'Failed to get emotion map data' });
    }
  });

  // User profile routes
  app.get('/api/user/profile', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await storage.getUser(req.session.user.email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        } 
      });
    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({ error: 'Failed to get user profile' });
    }
  });

  app.put('/api/user/profile', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const updatedUser = await storage.updateUserProfile(req.session.userId, { name });
      
      // Update session
      req.session.user.name = updatedUser.name;
      
      res.json({ 
        message: 'Profile updated successfully',
        user: { 
          id: updatedUser.id, 
          email: updatedUser.email, 
          name: updatedUser.name 
        } 
      });
    } catch (error) {
      console.error('Update user profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });
}