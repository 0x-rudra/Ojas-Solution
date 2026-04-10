import { pgTable, text, varchar, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Core User Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: text("password").notNull(), 
  backupSecret: text("backup_secret").notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(), 
  updatedAt: timestamp("updated_at").defaultNow().notNull(), 
});

// 2. Profile Details Table
export const profiles = pgTable("profiles", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  
  fullName: text("full_name").notNull(),
  avatarUrl: text("avatar_url"),          
  degree: text("degree"),               
  specialization: text("specialization"), 
  location: text("location"),           
  
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Streak Table
export const streaks = pgTable("streaks", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(), 
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
});

// --- Relations ---
export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  streak: one(streaks, {
    fields: [users.id],
    references: [streaks.userId],
  }),
}));
