//@ts-nocheck
import { integer, pgTable, varchar, uuid, 
  date, bigint, timestamp, date, json, unique, numb} from "drizzle-orm/pg-core";


export const sessions = pgTable("session", {
  sid: varchar().primaryKey().notNull(),
  sess: json().notNull(),
  expire: timestamp(6).notNull(),
  userID: uuid().references(() => users.userID),
})


export const users = pgTable("users", {
  userID: uuid().primaryKey().notNull().unique().defaultRandom(),
  username: varchar({ length: 16 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: date().notNull().default("now()"),
  updatedAt: date().notNull().default("now()"),
  lastLogin: date().notNull().default("now()"),
});

export const wallet = pgTable("wallet", {
  userID: uuid().notNull().unique().references(() => users.userID),
  nectar: bigint({mode: 'number'}).notNull().default(0),
  relics: bigint({mode: 'number'}).notNull().default(0),
  stardust: bigint({mode: 'number'}).notNull().default(0),
  prisms: bigint({mode: 'number'}).notNull().default(0),
  iron: bigint({mode: 'number'}).notNull().default(0),
  wheat: bigint({mode: 'number'}).notNull().default(0),
  gems: bigint({mode: 'number'}).notNull().default(0),
  wood: bigint({mode: 'number'}).notNull().default(0),
  steel: bigint({mode: 'number'}).notNull().default(0),
  food: bigint({mode: 'number'}).notNull().default(0),
  jewels: bigint({mode: 'number'}).notNull().default(0),
  planks: bigint({mode: 'number'}).notNull().default(0),
  cobalt: bigint({mode: 'number'}).notNull().default(0),
  granite: bigint({mode: 'number'}).notNull().default(0),
  diamonds: bigint({mode: 'number'}).notNull().default(0),
  hyperscales: bigint({mode: 'number'}).notNull().default(0),
})

export const levels = pgTable("levels", {
  userID: uuid().notNull().unique().references(() => users.userID),
  mastery_level: integer().notNull().default(1),
  mastery_xp: bigint({mode: 'number'}).notNull().default(0),
  mastery_xpnext: bigint({mode: 'number'}).notNull().default(100),
  mining_level: integer().notNull().default(1),
  mining_xp: bigint({mode: 'number'}).notNull().default(0),
  mining_xpnext: bigint({mode: 'number'}).notNull().default(100),
  harvesting_level: integer().notNull().default(1),
  harvesting_xp: bigint({mode: 'number'}).notNull().default(0),
  harvesting_xpnext: bigint({mode: 'number'}).notNull().default(100),
  spelunking_level: integer().notNull().default(1),
  spelunking_xp: bigint({mode: 'number'}).notNull().default(0),
  spelunking_xpnext: bigint({mode: 'number'}).notNull().default(100),
  logging_level: integer().notNull().default(1),
  logging_xp: bigint({mode: 'number'}).notNull().default(0),
  logging_xpnext: bigint({mode: 'number'}).notNull().default(100),
  refining_level: integer().notNull().default(1),
  refining_xp: bigint({mode: 'number'}).notNull().default(0),
  refining_xpnext: bigint({mode: 'number'}).notNull().default(100),
  smithing_level: integer().notNull().default(1),
  smithing_xp: bigint({mode: 'number'}).notNull().default(0),
  smithing_xpnext: bigint({mode: 'number'}).notNull().default(100),
  enchanting_level: integer().notNull().default(1),
  enchanting_xp: bigint({mode: 'number'}).notNull().default(0),
  enchanting_xpnext: bigint({mode: 'number'}).notNull().default(100),
})