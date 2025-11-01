import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Decks table - stores flashcard decks created by users
export const decks = pgTable('decks', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // Clerk user ID
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Cards table - stores individual flashcards within decks
export const cards = pgTable('cards', {
  id: serial('id').primaryKey(),
  deckId: integer('deck_id').notNull().references(() => decks.id, { onDelete: 'cascade' }),
  front: text('front').notNull(), // Question/prompt (e.g., "dog" or "When was the Battle of Hastings?")
  back: text('back').notNull(),   // Answer (e.g., "Anjing" or "1066")
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations for better query experience
export const decksRelations = relations(decks, ({ many }) => ({
  cards: many(cards),
}));

export const cardsRelations = relations(cards, ({ one }) => ({
  deck: one(decks, {
    fields: [cards.deckId],
    references: [decks.id],
  }),
}));
