# Environment Configuration

This document explains how to configure environment variables for the GDG FlashCard application.

## Environment Variables Overview

Environment variables are used to store configuration that changes between environments (development, production) and sensitive information that shouldn't be committed to version control.

## Creating Your .env.local File

Create a `.env.local` file in the root of your project with the following variables:

```bash
# Clerk Authentication
# Get these from your Clerk Dashboard: https://dashboard.clerk.com/last-active?path=api-keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_publishable_key_here"
CLERK_SECRET_KEY="sk_test_your_secret_key_here"

# Database Configuration
# Get this from your Neon dashboard: https://neon.tech
DATABASE_URL="postgresql://username:password@hostname:5432/database?sslmode=require"

# Other Configuration
NODE_ENV="development"
```

## Required Variables

### NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

Your Clerk publishable key. This is safe to expose to the browser and is required for client-side Clerk components.

**Format:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
```

**Where to get it:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application (or create a new one)
3. Go to "API Keys" in the sidebar
4. Copy the "Publishable key"

**Note:** The `NEXT_PUBLIC_` prefix makes this variable available to the browser. Clerk publishable keys are designed to be public.

### CLERK_SECRET_KEY

Your Clerk secret key. This is server-only and must never be exposed to the browser.

**Format:**
```
CLERK_SECRET_KEY="sk_test_..."
```

**Where to get it:**
1. In the same Clerk Dashboard "API Keys" page
2. Copy the "Secret key"
3. **NEVER commit this to version control!**

**Important:** This key has full access to your Clerk instance. Keep it secure!

### DATABASE_URL

Your PostgreSQL connection string from Neon.

**Format:**
```
postgresql://[username]:[password]@[hostname]:[port]/[database]?sslmode=require
```

**Example:**
```
DATABASE_URL="postgresql://myuser:mypassword@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**Where to get it:**
1. Go to [neon.tech](https://neon.tech)
2. Create an account and project
3. Go to your project dashboard
4. Click "Connection Details"
5. Copy the connection string

## Optional Variables

Clerk handles OAuth providers through its dashboard, so no additional environment variables are needed for social sign-in. To enable OAuth providers:

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to "Social Login" or "Authentication Providers"
3. Enable the providers you want (Google, GitHub, Microsoft, etc.)
4. Follow Clerk's setup instructions for each provider
5. Clerk manages the OAuth credentials automatically

**Popular OAuth Providers Supported by Clerk:**
- Google
- GitHub
- Microsoft
- Facebook
- Twitter/X
- Discord
- And many more!

## Environment Files

### .env.local (Development)

Used for local development. This file is gitignored and should never be committed.

### .env.production (Production)

Used in production builds. Also gitignored.

### .env.example (Template)

A template file that shows what variables are needed. This IS committed to version control but contains no actual secrets.

## Security Best Practices

### ❌ Never Do This

```bash
# Don't commit real secrets
git add .env.local
git commit -m "Add environment variables"
```

```typescript
// Don't hardcode secrets in code
const dbUrl = "postgresql://user:password@host/db";
```

```typescript
// Don't expose server secrets to client
export const config = {
  dbUrl: process.env.DATABASE_URL, // Exposed to browser!
  clerkSecret: process.env.CLERK_SECRET_KEY // Exposed to browser!
};
```

### ✅ Do This Instead

```bash
# Keep .env.local in .gitignore (it already is)
# Only commit .env.example with placeholder values
```

```typescript
// Use environment variables
const dbUrl = process.env.DATABASE_URL;
```

```typescript
// Only use env vars in server-side code
// app/api/route.ts (server)
const dbUrl = process.env.DATABASE_URL; // ✅ Safe
```

## Accessing Environment Variables

### Server-Side (API Routes, Server Components)

```typescript
// app/api/flashcards/route.ts
export async function GET() {
  const dbUrl = process.env.DATABASE_URL; // ✅ Available
  // ... use dbUrl
}
```

### Client-Side (Client Components)

Only variables prefixed with `NEXT_PUBLIC_` are available:

```typescript
// app/components/ClientComponent.tsx
"use client";

export function ClientComponent() {
  // ❌ This is undefined on client
  const secret = process.env.CLERK_SECRET_KEY;
  
  // ✅ This works - Clerk publishable key has NEXT_PUBLIC_ prefix
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // ✅ This works (if you add it)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
}
```

**Add public variables:**
```bash
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="GDG FlashCard"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..." # Already required
```

## Verifying Environment Variables

Create `src/lib/env.ts` to validate required variables:

```typescript
const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'DATABASE_URL',
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const env = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  DATABASE_URL: process.env.DATABASE_URL!,
};
```

Then use it:

```typescript
import { env } from '@/lib/env';

// ✅ Type-safe and validated
const dbUrl = env.DATABASE_URL;
```

## Deployment

### Vercel

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable
4. Redeploy

### Netlify

1. Go to Site settings
2. Navigate to "Environment variables"
3. Add each variable
4. Redeploy

### Docker

Create a `.env` file for Docker:

```dockerfile
# docker-compose.yml
services:
  app:
    build: .
    env_file:
      - .env.production
```

## Troubleshooting

### "Environment variable not found"

**Problem:** Variable is undefined at runtime

**Solution:**
1. Check `.env.local` exists in root directory
2. Restart dev server: `npm run dev`
3. Verify variable name matches exactly (case-sensitive)
4. Check for typos in variable name

### "Module not found" after adding .env

**Problem:** Dev server not picking up new .env file

**Solution:**
```bash
# Stop server (Ctrl+C)
# Restart
npm run dev
```

### Variables work locally but not in production

**Problem:** `.env.local` not deployed

**Solution:**
- Set environment variables in your hosting platform
- Don't rely on `.env` files in production

### Client component can't access variable

**Problem:** Using server-only variable in client component

**Solution:**
- Prefix with `NEXT_PUBLIC_` if it needs to be public
- Or pass the value from a server component as props

## Summary

1. ✅ Create `.env.local` with required variables
2. ✅ Never commit `.env.local` to Git
3. ✅ Keep sensitive data out of client-side code
4. ✅ Validate required variables on startup
5. ✅ Set environment variables in hosting platform for production

## Next Steps

- [Set up Database](./drizzle-setup.md)
- [Configure Authentication](./authentication.md)
- [Deploy to Production](./deployment.md)

