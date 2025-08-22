import bcrypt from "bcryptjs";
import { storage } from "./storage";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: Date;
}

export class AuthService {
  async registerUser(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthUser> {
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const existingUsername = await storage.getUserByUsername(userData.username);
    if (existingUsername) {
      throw new Error('Username is already taken');
    }

    // Create new user
    const user = await storage.createUser({
      ...userData,
      password: userData.password // Will be hashed in storage layer
    });

    // Return user without password
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      createdAt: user.createdAt
    };
  }

  async loginUser(email: string, password: string): Promise<AuthUser> {
    const user = await storage.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      createdAt: user.createdAt
    };
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    const user = await storage.getUser(id);
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      createdAt: user.createdAt
    };
  }
}

export const authService = new AuthService();

// Middleware for protecting routes
export const requireAuth = async (req: any, res: any, next: any) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const user = await authService.getUserById(userId);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  
  req.user = user;
  next();
};