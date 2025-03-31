import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const persons = pgTable("persons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  photoUrl: text("photo_url").notNull(),
  musicUrl: text("music_url").notNull(),
  musicTitle: text("music_title").notNull(),
  musicArtist: text("music_artist").notNull(),
});

export const insertPersonSchema = createInsertSchema(persons).omit({
  id: true,
});

export type InsertPerson = z.infer<typeof insertPersonSchema>;
export type Person = typeof persons.$inferSelect;
