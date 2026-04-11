import { db } from './db';
import { users, profiles, streaks } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Helper to generate 12 character random alphanumeric string
function generateBackupSecret() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for(let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function registerUser(username: string, passwordRaw: string) {
  try {
    // 1. Check if user exists
    const existing = await db.select().from(users).where(eq(users.username, username));
    if (existing.length > 0) {
      throw new Error("User already exists");
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(passwordRaw, 10);
    
    // 3. Generate backup secret
    const backupSecret = generateBackupSecret();

    // 4. Insert user, profile, streak sequentially (neon-http does not support transaction)
    const [newUser] = await db.insert(users).values({
      username,
      password: hashedPassword,
      backupSecret
    }).returning();

    const [newProfile] = await db.insert(profiles).values({
      userId: newUser.id,
      fullName: username, // Default to username
    }).returning();

    const [newStreak] = await db.insert(streaks).values({
      userId: newUser.id
    }).returning();

    return { user: newUser, profile: newProfile, streak: newStreak };
  } catch (err: any) {
    throw err;
  }
}

export async function loginUser(username: string, passwordRaw: string) {
  try {
    const existing = await db.select().from(users).where(eq(users.username, username));
    if (existing.length === 0) {
      throw new Error("Invalid credentials");
    }

    const targetUser = existing[0];
    const match = await bcrypt.compare(passwordRaw, targetUser.password);
    
    if (!match) {
      throw new Error("Invalid credentials");
    }

    const userProfile = await db.select().from(profiles).where(eq(profiles.userId, targetUser.id));

    return {
      user: {
        id: targetUser.id,
        username: targetUser.username,
        createdAt: targetUser.createdAt,
        updatedAt: targetUser.updatedAt
      },
      profile: userProfile[0] || null
    };
  } catch (err: any) {
    throw err;
  }
}
