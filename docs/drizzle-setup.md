# Drizzle ORM Setup Guide

This guide walks you through setting up Drizzle ORM to connect your Next.js application to a PostgreSQL database.

## What is Drizzle?

Drizzle ORM is a TypeScript ORM that provides:

- **Type Safety**: Full TypeScript support with inference
- **SQL-like Syntax**: Familiar to SQL developers
- **Zero Dependencies**: Lightweight and fast
- **Migrations**: Easy database schema evolution
- **Relations**: Type-safe joins and relations

## Why Drizzle vs Others?

| Feature | Drizzle | Prisma | TypeORM |
|---------|---------|--------|---------|
| Type Safety | ✅ Full | ✅ Full | ⚠️ Partial |
| Bundle Size | 🟢 Small | 🔴 Large | 🟡 Medium |
| Learning Curve | 🟢 Easy | 🟡 Medium | 🔴 Hard |
| SQL-like | ✅ Yes | ❌ No | ⚠️ Partial |
| Performance | 🟢 Fast | 🟡 Good | 🟡 Good |

## Installation

### 1. Install Dependencies

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

**Packages:**
- `drizzle-orm`: The ORM core
- `postgres`: PostgreSQL driver
- `drizzle-kit`: CLI tools for migrations

### 2. Create Database Connection

Create `src/db/client.ts`:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// For query purposes
const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient);
```

### 3. Define Database Schema

Create `src/db/schema.ts`:

```typescript
import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Decks table
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

// Flashcards table
export const flashcards = pgTable('flashcards', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  deckId: integer('deck_id').references(() => decks.id),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  difficulty: varchar('difficulty', { length: 20 }).default('medium'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Study sessions table
export const studySessions = pgTable('study_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  flashcardId: integer('flashcard_id').references(() => flashcards.id).notNull(),
  isCorrect: boolean('is_correct').notNull(),
  timeSpent: integer('time_spent'), // in seconds
  confidence: integer('confidence'), // 1-5 scale
  studiedAt: timestamp('studied_at').defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  decks: many(decks),
  flashcards: many(flashcards),
  studySessions: many(studySessions),
}));

export const decksRelations = relations(decks, ({ one, many }) => ({
  user: one(users, {
    fields: [decks.userId],
    references: [users.id],
  }),
  flashcards: many(flashcards),
}));

export const flashcardsRelations = relations(flashcards, ({ one, many }) => ({
  user: one(users, {
    fields: [flashcards.userId],
    references: [users.id],
  }),
  deck: one(decks, {
    fields: [flashcards.deckId],
    references: [decks.id],
  }),
  studySessions: many(studySessions),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(users, {
    fields: [studySessions.userId],
    references: [users.id],
  }),
  flashcard: one(flashcards, {
    fields: [studySessions.flashcardId],
    references: [flashcards.id],
  }),
}));
```

### 4. Configure Drizzle Kit

Create `drizzle.config.ts` in the root:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### 5. Add Scripts to package.json

Update your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Setting Up Neon Database

### 1. Create Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project

### 2. Get Connection String

1. In your Neon dashboard, go to your project
2. Click "Connection Details"
3. Copy the connection string
4. It looks like: `postgresql://username:password@hostname/database`

### 3. Add to Environment Variables

Add to your `.env.local`:

```bash
DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"
```

**Important:** Add `?sslmode=require` at the end for security.

## Running Migrations

### Generate Migration

When you change your schema:

```bash
npm run db:generate
```

This creates a SQL migration file in the `drizzle/` folder.

### Apply Migration

To apply migrations to your database:

```bash
npm run db:migrate
```

### Push Schema (Development)

For quick prototyping, push schema directly:

```bash
npm run db:push
```

**Warning:** This bypasses migrations. Use only in development!

## Drizzle Studio

Drizzle Studio is a database GUI:

```bash
npm run db:studio
```

Opens a web interface at `https://local.drizzle.studio` where you can:
- View all tables
- Browse data
- Run queries
- Edit records

## Using Drizzle in Your App

### Create a Flashcard

```typescript
import { db } from '@/db/client';
import { flashcards } from '@/db/schema';

export async function createFlashcard(userId: number, question: string, answer: string) {
  const [newCard] = await db.insert(flashcards).values({
    userId,
    question,
    answer,
  }).returning();
  
  return newCard;
}
```

### Get User's Flashcards

```typescript
import { db } from '@/db/client';
import { flashcards } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserFlashcards(userId: number) {
  return await db
    .select()
    .from(flashcards)
    .where(eq(flashcards.userId, userId));
}
```

### Get Flashcards with Deck Info

```typescript
import { db } from '@/db/client';
import { flashcards, decks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getFlashcardsWithDecks(userId: number) {
  return await db
    .select({
      id: flashcards.id,
      question: flashcards.question,
      answer: flashcards.answer,
      deckName: decks.name,
      deckColor: decks.color,
    })
    .from(flashcards)
    .leftJoin(decks, eq(flashcards.deckId, decks.id))
    .where(eq(flashcards.userId, userId));
}
```

### Update a Flashcard

```typescript
import { db } from '@/db/client';
import { flashcards } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function updateFlashcard(
  id: number,
  userId: number,
  data: { question?: string; answer?: string }
) {
  const [updated] = await db
    .update(flashcards)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(
      eq(flashcards.id, id),
      eq(flashcards.userId, userId) // Ensure user owns the card
    ))
    .returning();
    
  return updated;
}
```

### Delete a Flashcard

```typescript
import { db } from '@/db/client';
import { flashcards } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function deleteFlashcard(id: number, userId: number) {
  await db
    .delete(flashcards)
    .where(and(
      eq(flashcards.id, id),
      eq(flashcards.userId, userId)
    ));
}
```

### Use in API Route

```typescript
// app/api/flashcards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/db/client';
import { flashcards } from '@/db/schema';

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  
  const newCard = await db.insert(flashcards).values({
    userId: session.user.id,
    question: body.question,
    answer: body.answer,
  }).returning();
  
  return NextResponse.json(newCard[0]);
}
```

## Advanced Queries

### Aggregations

```typescript
import { count } from 'drizzle-orm';

// Count flashcards per deck
const deckStats = await db
  .select({
    deckId: decks.id,
    deckName: decks.name,
    cardCount: count(flashcards.id),
  })
  .from(decks)
  .leftJoin(flashcards, eq(decks.id, flashcards.deckId))
  .where(eq(decks.userId, userId))
  .groupBy(decks.id, decks.name);
```

### Transactions

```typescript
import { db } from '@/db/client';

// Use transactions for multiple operations
await db.transaction(async (tx) => {
  const [deck] = await tx.insert(decks).values({
    userId,
    name: 'New Deck',
  }).returning();
  
  await tx.insert(flashcards).values({
    userId,
    deckId: deck.id,
    question: 'First card',
    answer: 'Answer',
  });
});
```

### Pagination

```typescript
const pageSize = 20;
const page = 1;

const cards = await db
  .select()
  .from(flashcards)
  .where(eq(flashcards.userId, userId))
  .limit(pageSize)
  .offset((page - 1) * pageSize);
```

## Best Practices

### 1. Always Use Prepared Statements

Drizzle uses prepared statements by default - this prevents SQL injection.

### 2. Use Transactions for Related Operations

If multiple operations should succeed or fail together, use transactions.

### 3. Add Indexes for Performance

```typescript
import { index } from 'drizzle-orm/pg-core';

export const flashcards = pgTable('flashcards', {
  // ... columns
}, (table) => ({
  userIdIdx: index('flashcards_user_id_idx').on(table.userId),
  deckIdIdx: index('flashcards_deck_id_idx').on(table.deckId),
}));
```

### 4. Type Your Queries

```typescript
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { flashcards } from '@/db/schema';

export type Flashcard = InferSelectModel<typeof flashcards>;
export type NewFlashcard = InferInsertModel<typeof flashcards>;

function processFlashcard(card: Flashcard) {
  // TypeScript knows the exact shape of card
  console.log(card.question);
}
```

## Troubleshooting

### Connection Errors

```
Error: connect ECONNREFUSED
```

**Solution:** Check your `DATABASE_URL` in `.env.local`

### SSL Errors

```
Error: self signed certificate
```

**Solution:** Add `?sslmode=require` to your connection string

### Migration Errors

```
Error: relation "users" already exists
```

**Solution:** Your database already has tables. Either:
1. Drop all tables and re-run migrations
2. Or generate a new migration from current state

## Next Steps

Now that Drizzle is set up:

1. ✅ Schema defined
2. ✅ Migrations ready
3. ✅ Database connected

Next: [Implement Authentication](./authentication.md)

## Resources

- [Drizzle Docs](https://orm.drizzle.team/docs/overview)
- [Neon Docs](https://neon.tech/docs/introduction)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/)

Happy querying! 🚀

