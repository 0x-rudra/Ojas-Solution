import { db } from "../lib/db";
import { users, communities } from "../src/db/schema";
import bcrypt from "bcryptjs";

const predefinedRooms = [
  { id: "11111111-1111-1111-1111-111111111111", name: "NoFap Support 90-Day Challenge", description: "Addiction" },
  { id: "22222222-2222-2222-2222-222222222222", name: "PCOD Sisters & Natural Relief", description: "Women's Health" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Vata Balancing Group", description: "Ayurveda" },
  { id: "44444444-4444-4444-4444-444444444444", name: "Anxiety & Exam Stress Vent", description: "Mental Health" },
  { id: "55555555-5555-5555-5555-555555555555", name: "Meditation Daily Check-ins", description: "Mindfulness" },
  { id: "66666666-6666-6666-6666-666666666666", name: "Recovering from Breakups", description: "Relationships" }
];

async function seed() {
  console.log("Seeding Database...");
  
  // 1. Create a master dummy user to be the creator of all communities
  const pwd = await bcrypt.hash("masterpass123", 10);
  const [masterUser] = await db.insert(users).values({
    username: "system_master",
    password: pwd,
    backupSecret: "MASTER_SECRET_123"
  }).onConflictDoNothing({ target: users.username }).returning();

  let creatorId = masterUser?.id;
  if (!creatorId) {
    const existing = await db.select().from(users).where({ username: "system_master" } as any);
    creatorId = existing[0].id;
  }

  // 2. Insert predefined communities securely referencing the master creator
  for (const room of predefinedRooms) {
    try {
      await db.insert(communities).values({
        id: room.id,
        name: room.name,
        description: room.description,
        creatorId: creatorId
      }).onConflictDoNothing({ target: communities.id });
      console.log(`Seeded room: ${room.name}`);
    } catch (err: any) {
      console.error(`Failed to seed ${room.name}: ${err.message}`);
    }
  }
  
  console.log("Seed complete!");
}

seed().catch(console.error).finally(() => process.exit(0));
