import { pgTable, text, varchar, integer, timestamp, uuid, primaryKey, index, serial, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ------------------------------------
// Enums
// ------------------------------------
export const roleEnum = pgEnum('role', ['admin', 'member']);

// ------------------------------------
// Identity Tables
// ------------------------------------

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: text("password").notNull(), 
  backupSecret: text("backup_secret").notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(), 
  updatedAt: timestamp("updated_at").defaultNow().notNull(), 
});

export const profiles = pgTable("profiles", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  avatarUrl: text("avatar_url"),          
  degree: text("degree"),               
  specialization: text("specialization"), 
  location: text("location"),           
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const streaks = pgTable("streaks", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(), 
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
});

// ------------------------------------
// Community Tables
// ------------------------------------

export const communities = pgTable("communities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  creatorId: uuid("creator_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const communityMembers = pgTable("community_members", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  role: roleEnum("role").default("member").notNull(),
  lastMessageSentAt: timestamp("last_message_sent_at"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.communityId] }),
  communityIdx: index("community_idx").on(table.communityId),
}));

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  communityId: uuid("community_id").notNull().references(() => communities.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(), // Max length validated in Zod
  sentAt: timestamp("sent_at").defaultNow().notNull(),
}, (table) => ({
  // Drizzle supports .desc() on indices in recent versions but standard indexing on (communityId, sentAt)
  // allows efficient reverse scanning for order by sentAt desc where communityId = X
  communityDateIdx: index("community_date_idx").on(table.communityId, table.sentAt),
}));

// ------------------------------------
// Relations
// ------------------------------------

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  streak: one(streaks, { fields: [users.id], references: [streaks.userId] }),
  communityMemberships: many(communityMembers),
  messages: many(messages)
}));

export const communitiesRelations = relations(communities, ({ one, many }) => ({
  creator: one(users, { fields: [communities.creatorId], references: [users.id] }),
  members: many(communityMembers),
  messages: many(messages),
}));
