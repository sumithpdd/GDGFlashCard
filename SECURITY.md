# Security Policy

## Overview

GDG FlashCard takes security seriously. This document outlines our security practices and how to report vulnerabilities.

## Security Measures Implemented

### 1. Authentication & Authorization

- **Clerk Authentication**: Industry-standard authentication provider
- **User Isolation**: All data operations enforce user-specific access
- **Session Management**: Automatic session handling and token refresh
- **Protected Routes**: Middleware enforces authentication on protected pages

### 2. Data Security

- **Server-Side Validation**: All inputs validated with Zod schemas
- **SQL Injection Prevention**: Drizzle ORM parameterizes all queries
- **User Data Isolation**: Database queries always filter by authenticated userId
- **No Direct Database Exposure**: All operations go through the ORM layer

### 3. Environment Variables

- **Never Committed**: All `.env*` files are gitignored (except `.env.example`)
- **Server-Only Secrets**: Database credentials and secret keys never exposed to browser
- **Public Variables Prefixed**: Only `NEXT_PUBLIC_*` variables accessible client-side
- **Template File**: `.env.example` provides structure without real credentials

### 4. Database Security

- **Connection Security**: SSL/TLS required for database connections
- **Hosted Database**: Using Neon's secure PostgreSQL hosting
- **Access Control**: Row-level security through userId filtering
- **Cascade Deletes**: Proper foreign key constraints prevent orphaned data

## Best Practices for Contributors

### ❌ Never Do This

```typescript
// DON'T: Hardcode secrets
const apiKey = "sk_test_real_key_here";

// DON'T: Expose server secrets to client
"use client";
const dbUrl = process.env.DATABASE_URL; // Undefined on client

// DON'T: Skip user validation
const decks = await db.select().from(decks); // Gets ALL users' decks!

// DON'T: Trust user input
const deckId = request.body.deckId;
await db.delete(decks).where(eq(decks.id, deckId)); // Dangerous!

// DON'T: Commit environment files
git add .env.local
```

### ✅ Always Do This

```typescript
// DO: Use environment variables
const apiKey = process.env.CLERK_SECRET_KEY;

// DO: Use server-only code for secrets
// app/api/route.ts (Server Component or API Route)
const dbUrl = process.env.DATABASE_URL; // Safe

// DO: Always filter by authenticated user
const userId = auth().userId;
const decks = await db.select().from(decks).where(eq(decks.userId, userId));

// DO: Validate input and check ownership
const parsed = schema.safeParse(input);
const userId = auth().userId;
const deck = await db.query.decks.findFirst({
  where: and(eq(decks.id, deckId), eq(decks.userId, userId))
});
if (!deck) throw new Error("Unauthorized");

// DO: Use .env.local for local development
cp .env.example .env.local
# Edit .env.local with real values
```

## Security Checklist for New Features

Before implementing any new feature that handles user data:

- [ ] Server actions use Zod validation for all inputs
- [ ] Database queries filter by authenticated userId
- [ ] No sensitive data exposed to client components
- [ ] Error messages don't leak sensitive information
- [ ] Authorization checks before any update/delete operations
- [ ] Environment variables used for all configuration
- [ ] No secrets hardcoded in source code
- [ ] API routes properly authenticated
- [ ] Input sanitized and validated
- [ ] SQL injection prevented (using ORM)

## Threat Model

### What We Protect Against

1. **Unauthorized Data Access**
   - Users can only access their own decks and cards
   - All queries enforce userId filtering
   - Server-side authorization checks

2. **SQL Injection**
   - Drizzle ORM automatically parameterizes queries
   - No raw SQL concatenation
   - Type-safe query building

3. **Credential Exposure**
   - Environment variables for all secrets
   - `.gitignore` prevents accidental commits
   - Server-only code for sensitive operations

4. **Session Hijacking**
   - Clerk manages secure sessions
   - Automatic token rotation
   - HTTPOnly cookies

5. **XSS (Cross-Site Scripting)**
   - React automatically escapes output
   - No `dangerouslySetInnerHTML` usage
   - Content Security Policy headers (when configured)

### Known Limitations

1. **Client-Side Data**
   - Any data sent to client components is visible in browser
   - Don't send sensitive data to client components

2. **Rate Limiting**
   - Currently no rate limiting on API routes
   - Consider implementing if needed

3. **CORS**
   - Not configured for API access
   - Consider if building external API access

## Reporting Vulnerabilities

If you discover a security vulnerability, please:

1. **Do NOT open a public issue**
2. **Email the maintainers** with details
3. Include steps to reproduce
4. Allow time for a fix before public disclosure

### What to Report

- Authentication bypass
- Data exposure across users
- SQL injection vulnerabilities
- Exposed credentials in code
- Authorization issues
- Session management flaws

### What NOT to Report

- Features working as designed
- Issues requiring physical access to server
- Social engineering attacks
- Denial of service (unless critical)

## Security Updates

### Updating Dependencies

```bash
# Check for vulnerabilities
npm audit

# Fix automatically where possible
npm audit fix

# Update dependencies
npm update
```

### Regular Maintenance

- Monitor dependency vulnerabilities
- Keep Next.js and React updated
- Review Clerk security advisories
- Update database connection libraries

## Compliance

### Data Handling

- User data stored securely in PostgreSQL
- Authentication handled by Clerk (SOC 2 compliant)
- No sensitive data in logs
- User data deletable on request

### Privacy

- Only collect necessary data
- Users own their flashcard data
- No third-party analytics (currently)
- Clear data ownership model

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Clerk Security](https://clerk.com/docs/security/overview)
- [Neon Security](https://neon.tech/docs/security/security-overview)

## Questions?

For security questions or concerns, please review:
- This SECURITY.md file
- [Authentication docs](./docs/authentication.md)
- [Database docs](./docs/database.md)
- [Environment setup](./docs/environment-setup.md)

---

**Last Updated**: November 2025  
**Version**: 1.0.0

