import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, communities, communityMembers, messages } from '@/src/db/schema';
import { joinCommunity, sendMessage, getCommunityMessages } from '@/lib/community-services';
import bcrypt from 'bcryptjs';
import { eq, and } from 'drizzle-orm';

export async function GET() {
  const logs: any[] = [];
  try {
    logs.push("1. Creating test user...");
    const pwd = await bcrypt.hash("test1234", 10);
    const [user] = await db.insert(users).values({
      username: "test_bot_" + Math.random().toString().substring(2, 6),
      password: pwd,
      backupSecret: "test"
    }).returning();
    logs.push("User ID: " + user.id);

    logs.push("2. Fetching a community...");
    const [comm] = await db.select().from(communities).limit(1);
    if (!comm) throw new Error("No communities found");
    logs.push("Community ID: " + comm.id);

    logs.push("3. Joining community...");
    const joinRes = await joinCommunity(user.id, comm.id);
    logs.push("Join result: " + JSON.stringify(joinRes));

    logs.push("4. Verifying communityMembers...");
    const member = await db.select().from(communityMembers)
      .where(and(eq(communityMembers.userId, user.id), eq(communityMembers.communityId, comm.id)));
    logs.push("Member found count: " + member.length);

    if (!member.length) {
      logs.push("ERROR: MEMBER NOT INSERTED!!");
    }

    logs.push("5. Sending message...");
    const msg = await sendMessage(user.id, comm.id, "Hello from test bot!");
    logs.push("SendMessage Result: ID -> " + msg.id);

    logs.push("6. Verifying messages length...");
    const msgs = await getCommunityMessages(comm.id, 50, 0);
    logs.push("GetCommunityMessages length: " + msgs.length);

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, logs, error: error.message }, { status: 500 });
  }
}
