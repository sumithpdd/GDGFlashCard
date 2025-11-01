# Architecture Overview

## Introduction

GDG FlashCard is built as a full-stack application using Next.js, which provides both the frontend user interface and backend API functionality in a single cohesive framework.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User's Browser                     │
│  ┌────────────────────────────────────────────────┐ │
│  │          React Components (Client)             │ │
│  └────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────┘
                        │ HTTP Requests
                        │
┌───────────────────────▼─────────────────────────────┐
│              Next.js Server                         │
│  ┌────────────────────────────────────────────────┐ │
│  │         Server Components / API Routes         │ │
│  │                                                 │ │
│  │  - Authentication Middleware                   │ │
│  │  - Business Logic                              │ │
│  │  - Request Validation                          │ │
│  └───────────────────┬────────────────────────────┘ │
└────────────────────────┬────────────────────────────┘
                         │
                         │ Drizzle ORM
                         │
┌────────────────────────▼────────────────────────────┐
│            Neon PostgreSQL Database                 │
│  ┌────────────────────────────────────────────────┐ │
│  │  - Users Table                                  │ │
│  │  - Flashcards Table                            │ │
│  │  - Study Sessions Table                        │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend Layer (Browser)

The frontend runs in the user's web browser and consists of:

- **React Components**: Interactive UI elements built with React 19
- **Client Components**: Components that need browser APIs or interactivity
- **Server Components**: Components that fetch data on the server (default in Next.js App Router)

**Key Responsibilities:**
- Render user interface
- Handle user interactions
- Send requests to the server
- Display loading states and errors

### Backend Layer (Next.js Server)

The backend runs on a Node.js server and handles:

- **API Routes**: RESTful endpoints for data operations
- **Server Actions**: Direct server functions callable from client components
- **Authentication**: Verify user identity on every request
- **Authorization**: Ensure users can only access their own data

**Key Responsibilities:**
- Validate incoming requests
- Authenticate users
- Execute business logic
- Communicate with the database
- Return responses to the client

### Data Layer (Drizzle + PostgreSQL)

The data layer manages persistent storage:

- **Drizzle ORM**: Type-safe database toolkit
- **Neon PostgreSQL**: Cloud-hosted database
- **Schema Definitions**: TypeScript types matching database structure

**Key Responsibilities:**
- Store user data
- Maintain data relationships
- Ensure data integrity
- Provide efficient queries

## Request Flow Example

Let's walk through what happens when a user creates a new flashcard:

1. **User Action**: User fills out a form and clicks "Create Flashcard"

2. **Client Request**: React component sends a POST request to the server
   ```
   POST /api/flashcards
   Body: { question: "What is React?", answer: "A JavaScript library" }
   ```

3. **Server Authentication**: Server checks if the user is logged in
   - If not authenticated → Return 401 Unauthorized
   - If authenticated → Continue to next step

4. **Request Validation**: Server validates the flashcard data
   - Check required fields are present
   - Validate data types and formats
   - Sanitize input to prevent attacks

5. **Database Operation**: Server uses Drizzle to insert the flashcard
   ```typescript
   await db.insert(flashcards).values({
     userId: session.user.id,
     question: validatedData.question,
     answer: validatedData.answer,
     createdAt: new Date()
   });
   ```

6. **Database Execution**: Neon PostgreSQL stores the data

7. **Response**: Server sends success response back to client

8. **UI Update**: Client updates the interface to show the new flashcard

## Why This Architecture?

### Full-Stack Integration

Next.js bundles everything together, providing:
- **Simplified Development**: One codebase for frontend and backend
- **Type Safety**: Share types between client and server
- **Optimized Performance**: Automatic code splitting and optimization
- **Built-in Routing**: File-based routing system

### Security Benefits

- **Server-Side Validation**: All data is validated before reaching the database
- **Authentication Gates**: Easy to protect routes and API endpoints
- **Environment Variables**: Sensitive data (API keys, database URLs) stays on the server
- **No Direct Database Access**: Clients can't bypass server logic

### Drizzle ORM Advantages

- **Type Safety**: Catch errors at compile time, not runtime
- **Schema as Code**: Database structure is defined in TypeScript
- **Migrations**: Easy to evolve your database schema
- **AI-Friendly**: Cursor AI can understand and work with your database

Without Drizzle, you'd write raw SQL:
```typescript
// Without Drizzle - error-prone
await db.query('INSERT INTO flashcards (user_id, question) VALUES ($1, $2)', [userId, question]);
```

With Drizzle - type-safe:
```typescript
// With Drizzle - typed and validated
await db.insert(flashcards).values({ userId, question });
```

## Scalability Considerations

This architecture can grow with your application:

- **Horizontal Scaling**: Deploy multiple Next.js instances behind a load balancer
- **Database Connection Pooling**: Neon provides connection pooling
- **Edge Functions**: Deploy API routes to edge locations for lower latency
- **Caching**: Add Redis for session storage and caching
- **CDN**: Static assets served from global CDN

## Next Steps

As the application grows, you might add:

- **Background Jobs**: For sending emails, processing analytics
- **Real-time Features**: WebSockets for collaborative study sessions
- **File Storage**: S3 for image uploads on flashcards
- **Search**: Full-text search with PostgreSQL or Elasticsearch
- **Analytics**: Track study patterns and progress

## Conclusion

This architecture provides a solid foundation for a full-stack application with clear separation of concerns, type safety, and security built-in from the start.

