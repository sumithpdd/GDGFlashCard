# Database Schema Documentation

## Overview

This document describes the database schema for the GDG FlashCard application. The database is PostgreSQL hosted on Neon, accessed through Drizzle ORM.

## Why PostgreSQL?

PostgreSQL is a powerful, open-source relational database that provides:

- **ACID Compliance**: Ensures data integrity
- **Advanced Features**: JSON support, full-text search, triggers
- **Scalability**: Handles millions of records efficiently
- **Community Support**: Extensive documentation and tools

## Why Neon?

Neon is a serverless PostgreSQL platform that offers:

- **Instant Provisioning**: Database ready in seconds
- **Autoscaling**: Scales based on usage
- **Generous Free Tier**: Perfect for development
- **Branching**: Create database branches like Git
- **Built-in Connection Pooling**: Efficient connection management

## Database Management Commands

### Updating Your Database Schema

After modifying your schema in `src/db/schema.ts`, you need to sync those changes to your Neon database:

#### Quick Update (Development)
```bash
npm run db:push
```
- **Use for:** Local development, quick iterations
- **Effect:** Directly syncs schema without creating migration files
- **Fast** and convenient for prototyping

#### Production Workflow
```bash
# 1. Generate migration files
npm run db:generate

# 2. Review the generated SQL in drizzle/ folder

# 3. Apply migrations to database  
npm run db:migrate
```
- **Use for:** Production deployments, team projects
- **Effect:** Creates versioned migration files for tracking changes
- **Safe** and reversible with version control

#### Viewing Your Database
```bash
npm run db:studio
```
Opens Drizzle Studio at `https://local.drizzle.studio` to:
- Browse tables and data visually
- Run queries interactively
- Verify schema changes

> 💡 **See [drizzle-setup.md](./drizzle-setup.md) for detailed migration workflows and examples.**

---

## Schema Design

### Users Table

Stores user account information and authentication data.

```typescript
// Schema definition (to be implemented in db/schema.ts)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Fields:**
- `id`: Unique identifier for each user
- `email`: User's email address (unique, required for login)
- `username`: Display name (unique)
- `passwordHash`: Encrypted password (never store plain text!)
- `createdAt`: When the account was created
- `updatedAt`: Last time the account was modified

### Flashcards Table

Stores individual flashcard content.

```typescript
export const flashcards = pgTable('flashcards', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  deckId: integer('deck_id').references(() => decks.id),
  difficulty: varchar('difficulty', { length: 20 }).default('medium'),
  tags: varchar('tags', { length: 255 }).array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Fields:**
- `id`: Unique identifier for each flashcard
- `userId`: Reference to the user who owns this flashcard
- `question`: The question/prompt side of the card
- `answer`: The answer/response side of the card
- `deckId`: Optional reference to a deck (collection)
- `difficulty`: User-set difficulty level (easy, medium, hard)
- `tags`: Array of tags for organization
- `createdAt`: When the card was created
- `updatedAt`: Last time the card was modified

### Decks Table

Organizes flashcards into collections.

```typescript
export const decks = pgTable('decks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 7 }).default('#3B82F6'),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Fields:**
- `id`: Unique identifier for each deck
- `userId`: Reference to the user who owns this deck
- `name`: Name of the deck
- `description`: Optional description
- `color`: Hex color code for UI display
- `isPublic`: Whether other users can view this deck
- `createdAt`: When the deck was created
- `updatedAt`: Last time the deck was modified

### Study Sessions Table

Tracks user study activity and performance.

```typescript
export const studySessions = pgTable('study_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  flashcardId: integer('flashcard_id').references(() => flashcards.id).notNull(),
  isCorrect: boolean('is_correct').notNull(),
  timeSpent: integer('time_spent'), // seconds
  confidence: integer('confidence'), // 1-5 scale
  studiedAt: timestamp('studied_at').defaultNow().notNull(),
});
```

**Fields:**
- `id`: Unique identifier for each study attempt
- `userId`: Reference to the user studying
- `flashcardId`: Reference to the flashcard being studied
- `isCorrect`: Whether the user answered correctly
- `timeSpent`: How long the user took (in seconds)
- `confidence`: User's self-reported confidence (1-5)
- `studiedAt`: When this study session occurred

## Relationships

### One-to-Many Relationships

1. **User → Flashcards**
   - One user can have many flashcards
   - Each flashcard belongs to exactly one user
   - Enforced by `userId` foreign key in flashcards table

2. **User → Decks**
   - One user can have many decks
   - Each deck belongs to exactly one user
   - Enforced by `userId` foreign key in decks table

3. **Deck → Flashcards**
   - One deck can contain many flashcards
   - Each flashcard can belong to zero or one deck
   - Enforced by optional `deckId` foreign key in flashcards table

4. **User → Study Sessions**
   - One user can have many study sessions
   - Each session belongs to exactly one user

5. **Flashcard → Study Sessions**
   - One flashcard can have many study sessions
   - Each session relates to exactly one flashcard

## Entity Relationship Diagram

```
┌─────────────┐
│    Users    │
├─────────────┤
│ id          │───┐
│ email       │   │
│ username    │   │
└─────────────┘   │
                  │ 1:N
                  │
        ┌─────────┴──────────┬─────────────────┐
        │                    │                 │
        ▼                    ▼                 ▼
┌─────────────┐      ┌─────────────┐  ┌───────────────┐
│   Decks     │      │  Flashcards │  │StudySessions  │
├─────────────┤      ├─────────────┤  ├───────────────┤
│ id          │──┐   │ id          │  │ id            │
│ userId      │  │   │ userId      │  │ userId        │
│ name        │  │   │ question    │  │ flashcardId   │
└─────────────┘  │   │ answer      │  │ isCorrect     │
                 │   │ deckId      │  │ studiedAt     │
                 │   └─────────────┘  └───────────────┘
                 │         ▲
                 │ 1:N     │
                 └─────────┘
```

## Data Security

### Row-Level Security

Every query includes the user ID to ensure data isolation:

```typescript
// Good: Only fetch current user's flashcards
const userCards = await db
  .select()
  .from(flashcards)
  .where(eq(flashcards.userId, session.user.id));

// Bad: This would expose all users' flashcards!
const allCards = await db.select().from(flashcards);
```

### Best Practices

1. **Always filter by userId**: Never return data without checking ownership
2. **Validate on the server**: Never trust client-side validation alone
3. **Use transactions**: For operations that modify multiple tables
4. **Index frequently queried fields**: Like userId, deckId for performance
5. **Hash passwords**: Never store passwords in plain text

## Indexes

Indexes improve query performance:

```typescript
// Add indexes to frequently queried columns
export const flashcardsUserIdIndex = index('flashcards_user_id_idx')
  .on(flashcards.userId);

export const flashcardsDeckIdIndex = index('flashcards_deck_id_idx')
  .on(flashcards.deckId);

export const studySessionsUserIdIndex = index('study_sessions_user_id_idx')
  .on(studySessions.userId);
```

## Migrations

Drizzle generates migration files when you change the schema:

```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate
```

Migration files track schema changes over time, making it safe to update production databases.

## Query Examples

### Create a Flashcard

```typescript
const newCard = await db.insert(flashcards).values({
  userId: session.user.id,
  question: "What is TypeScript?",
  answer: "A typed superset of JavaScript",
  difficulty: "medium"
}).returning();
```

### Get User's Decks with Flashcard Count

```typescript
const userDecks = await db
  .select({
    id: decks.id,
    name: decks.name,
    cardCount: count(flashcards.id)
  })
  .from(decks)
  .leftJoin(flashcards, eq(decks.id, flashcards.deckId))
  .where(eq(decks.userId, session.user.id))
  .groupBy(decks.id);
```

### Record Study Session

```typescript
await db.insert(studySessions).values({
  userId: session.user.id,
  flashcardId: cardId,
  isCorrect: true,
  timeSpent: 15,
  confidence: 4
});
```

## Future Enhancements

Potential schema additions:

- **Spaced Repetition Data**: Track when cards should be reviewed next
- **Shared Decks**: Allow users to share decks with others
- **Comments**: Let users comment on shared flashcards
- **Media Attachments**: Store references to images/audio files
- **Achievement System**: Track user progress and milestones

## Conclusion

This schema provides a solid foundation for the flashcard application with proper relationships, security considerations, and room for future growth.

