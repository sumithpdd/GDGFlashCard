# Environment Configuration

This document explains how to configure environment variables for the GDG FlashCard application.

## Environment Variables Overview

Environment variables are used to store configuration that changes between environments (development, production) and sensitive information that shouldn't be committed to version control.

## Creating Your .env.local File

Create a `.env.local` file in the root of your project with the following variables:

```bash
# Database Configuration
# Get this from your Neon dashboard: https://neon.tech
DATABASE_URL="postgresql://username:password@hostname:5432/database?sslmode=require"

# NextAuth Configuration
# Generate a secret with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-key-here"

# The URL of your application
# Development: http://localhost:3000
# Production: https://yourdomain.com
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
# Get these from respective provider dashboards

# Google OAuth
# https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# GitHub OAuth
# https://github.com/settings/developers
GITHUB_ID=""
GITHUB_SECRET=""

# Other Configuration
NODE_ENV="development"
```

## Required Variables

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

### NEXTAUTH_SECRET

A random string used to encrypt session tokens.

**Generate:**
```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Example:**
```
NEXTAUTH_SECRET="Xm2k9pLqR3vBnN8yT5wZ7aF1dS4gH6j0"
```

### NEXTAUTH_URL

The URL where your application is running.

**Development:**
```
NEXTAUTH_URL="http://localhost:3000"
```

**Production:**
```
NEXTAUTH_URL="https://yourdomain.com"
```

## Optional Variables

### Google OAuth

To enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

```bash
GOOGLE_CLIENT_ID="123456789-abc123.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abc123def456"
```

### GitHub OAuth

To enable GitHub sign-in:

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and generate Client Secret

```bash
GITHUB_ID="abc123def456"
GITHUB_SECRET="abc123def456ghi789jkl012"
```

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
// Don't expose secrets to client
export const config = {
  dbUrl: process.env.DATABASE_URL // Exposed to browser!
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
  const secret = process.env.NEXTAUTH_SECRET;
  
  // ✅ This works (if you add it)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
}
```

**Add public variables:**
```bash
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="GDG FlashCard"
```

## Verifying Environment Variables

Create `src/lib/env.ts` to validate required variables:

```typescript
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
  // Optional vars
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_ID: process.env.GITHUB_ID,
  GITHUB_SECRET: process.env.GITHUB_SECRET,
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

