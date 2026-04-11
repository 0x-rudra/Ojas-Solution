import { db } from "../lib/db";
import { users, communities, communityMembers, messages } from "../src/db/schema";
import { app, AppError, joinCommunity, sendMessage, getCommunityMessages } from "../lib/community-services";
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";

async function testFlow() {
  console.log("1. Creating test user...");
  const pwd = await bcrypt.hash("test1234", 10);
  const [user] = await db.insert(users).values({
    username: "test_bot_" + Math.random().toString().substring(2, 6),
    password: pwd,
    backupSecret: "test"
  }).returning();
  
  console.log("User ID:", user.id);

  console.log("2. Fetching a community...");
  const [comm] = await db.select().from(communities).limit(1);
  if (!comm) throw new Error("No communities found");
  console.log("Community ID:", comm.id);

  console.log("3. Joining community...");
  const joinRes = await joinCommunity(user.id, comm.id);
  console.log("Join result:", joinRes);

  console.log("4. Verifying communityMembers...");
  const member = await db.select().from(communityMembers)
    .where(and(eq(communityMembers.userId, user.id), eq(communityMembers.communityId, comm.id)));
  console.log("Member found count:", member.length);

  if (!member.length) {
    console.error("MEMBER NOT INSERTED!!");
  }

  console.log("5. Sending message...");
  try {
    const msg = await sendMessage(user.id, comm.id, "Hello from test bot!");
    console.log("SendMessage Result:", msg);
  } catch (e: any) {
    console.error("SendMessage Error:", e);
  }

  console.log("6. Verifying messages length...");
  const msgs = await getCommunityMessages(comm.id, 50, 0);
  console.log("GetCommunityMessages length:", msgs.length);
}

testFlow().then(() => process.exit(0)).catch(console.error);
