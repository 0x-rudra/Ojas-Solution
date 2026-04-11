import { db } from "./db";
import { communities, communityMembers, messages, users, profiles } from "@/src/db/schema";
import { eq, and, desc } from "drizzle-orm";

const COOLDOWN_SECONDS = 30;

// Custom Error Class
export class AppError extends Error {
  public status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "AppError";
  }
}

export async function joinCommunity(userId: string, communityId: string) {
  // Check if community exists
  const existingCommunity = await db.select().from(communities).where(eq(communities.id, communityId));
  if (existingCommunity.length === 0) {
    throw new AppError("Community not found", 404);
  }

  // Check if user is already a member
  const existingMember = await db.select().from(communityMembers)
    .where(and(eq(communityMembers.userId, userId), eq(communityMembers.communityId, communityId)));
    
  if (existingMember.length > 0) {
    throw new AppError("You are already a member of this community", 400);
  }

  // Insert safely
  await db.insert(communityMembers).values({
    userId,
    communityId,
    role: "member"
  });

  return { message: "Successfully joined the community" };
}

export async function sendMessage(userId: string, communityId: string, content: string) {
  // 1. Fetch the member record
  const memberRecords = await db.select().from(communityMembers)
    .where(and(eq(communityMembers.userId, userId), eq(communityMembers.communityId, communityId)));

  if (memberRecords.length === 0) {
    throw new AppError("You must join the community first", 403);
  }

  const member = memberRecords[0];

  // 2. Rate Limiting Check
  if (member.lastMessageSentAt) {
    const elapsedSeconds = (Date.now() - member.lastMessageSentAt.getTime()) / 1000;
    if (elapsedSeconds < COOLDOWN_SECONDS) {
      const remaining = Math.ceil(COOLDOWN_SECONDS - elapsedSeconds);
      throw new AppError(`Please wait ${remaining} seconds before sending another message.`, 429);
    }
  }

  // 3. Insert and Update sequentially (since http blocks transactions)
  const now = new Date();
  
  const [newMessage] = await db.insert(messages).values({
    communityId,
    senderId: userId,
    content,
    sentAt: now
  }).returning();

  await db.update(communityMembers)
    .set({ lastMessageSentAt: now })
    .where(and(eq(communityMembers.userId, userId), eq(communityMembers.communityId, communityId)));

  // 4. Enforce 50 messages limit per community
  // We fetch the latest 50 message IDs, and delete anything not in that list for this community
  const communityMessages = await db.select({ id: messages.id })
    .from(messages)
    .where(eq(messages.communityId, communityId))
    .orderBy(desc(messages.sentAt));
    
  if (communityMessages.length > 50) {
    const idsToDelete = communityMessages.slice(50).map(m => m.id);
    // Drizzle requires array to have at least one element for inArray
    if (idsToDelete.length > 0) {
      // Need to import inArray if not already imported
      // Wait, we need to make sure `inArray` is imported. Let's fix imports too if necessary.
      // But instead of inArray, we can just delete in a loop? No, inArray is best.
      const { inArray } = await import("drizzle-orm");
      await db.delete(messages).where(inArray(messages.id, idsToDelete));
    }
  }

  return newMessage;
}

export async function getCommunityMessages(communityId: string, limit: number = 50, offset: number = 0) {
  // Query with pagination and User join
  const result = await db.select({
    id: messages.id,
    content: messages.content,
    sentAt: messages.sentAt,
    sender: {
      id: users.id,
      username: users.username,
      avatarUrl: profiles.avatarUrl,
    }
  })
  .from(messages)
  .where(eq(messages.communityId, communityId))
  .innerJoin(users, eq(messages.senderId, users.id))
  .leftJoin(profiles, eq(users.id, profiles.userId))
  .orderBy(desc(messages.sentAt))
  .limit(limit)
  .offset(offset);

  return result.reverse(); // Reverse to return oldest first in the final payload if needed for chat, or keep descending! Descending is standard for fetching recent.
}
