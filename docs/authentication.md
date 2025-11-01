# Authentication Documentation

## Overview

Authentication is the process of verifying who a user is. This application requires users to create accounts and log in before they can create or study flashcards.

## Why Authentication Matters

Authentication is critical for:

1. **Data Privacy**: Ensures users only see their own flashcards
2. **Personalization**: Tailors the experience to each user
3. **Security**: Prevents unauthorized access
4. **Accountability**: Tracks who created what content

## Authentication Strategy

This application will use **NextAuth.js** (Auth.js) for authentication, which provides:

- **Multiple Providers**: Email/password, Google, GitHub, etc.
- **Session Management**: Secure session handling
- **CSRF Protection**: Built-in security features
- **Type Safety**: Full TypeScript support
- **Next.js Integration**: Works seamlessly with App Router

## Authentication Flow

### Registration Flow

```
1. User visits /signup
2. User enters email, username, password
3. Client sends POST request to /api/auth/signup
4. Server validates input:
   - Email format is valid
   - Password meets requirements
   - Username is unique
   - Email is not already registered
5. Server hashes the password (using bcrypt)
6. Server creates new user in database
7. Server creates session for the user
8. User is redirected to dashboard
```

### Login Flow

```
1. User visits /login
2. User enters email and password
3. Client sends POST request to /api/auth/signin
4. Server looks up user by email
5. Server compares password hash:
   - If match: Create session, redirect to dashboard
   - If no match: Return error
6. Session cookie is set in browser
7. User is logged in
```

### Session Management

```
1. User makes request to protected page
2. Server checks for session cookie
3. Server validates session:
   - If valid: Allow request, attach user info
   - If invalid: Redirect to login
4. Session expires after period of inactivity
5. User can manually log out to end session
```

## Password Security

### Hashing

Passwords are **never** stored in plain text. We use bcrypt to hash passwords:

```typescript
import bcrypt from 'bcrypt';

// When user signs up
const saltRounds = 10;
const passwordHash = await bcrypt.hash(plainPassword, saltRounds);
// Store passwordHash in database

// When user logs in
const isValid = await bcrypt.compare(plainPassword, storedHash);
```

**Why bcrypt?**
- Slow by design (prevents brute force attacks)
- Automatically handles salt generation
- Industry standard for password hashing

### Password Requirements

Enforce strong passwords:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

```typescript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
```

## Protecting Routes

### Server Components

```typescript
// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }
  
  // User is authenticated, render page
  return <div>Welcome, {session.user.name}!</div>;
}
```

### API Routes

```typescript
// app/api/flashcards/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // User is authenticated, process request
  const userId = session.user.id;
  // ... create flashcard
}
```

### Client Components

```typescript
// app/components/LoginButton.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function LoginButton() {
  const { data: session } = useSession();
  
  if (session) {
    return (
      <>
        Signed in as {session.user.email}
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  
  return <button onClick={() => signIn()}>Sign in</button>;
}
```

## Authorization

While **authentication** verifies *who* you are, **authorization** determines *what you can do*.

### Checking Ownership

Always verify users can only access their own data:

```typescript
// Get flashcard by ID
const flashcard = await db
  .select()
  .from(flashcards)
  .where(eq(flashcards.id, cardId))
  .limit(1);

// Check ownership
if (!flashcard || flashcard.userId !== session.user.id) {
  return new Response("Forbidden", { status: 403 });
}

// User owns this flashcard, allow operation
```

### Role-Based Access (Future)

For future expansion, you might add user roles:

```typescript
enum UserRole {
  USER = "user",
  MODERATOR = "moderator",
  ADMIN = "admin"
}

// Check if user is admin
if (session.user.role !== UserRole.ADMIN) {
  return new Response("Forbidden", { status: 403 });
}
```

## Session Storage

Sessions can be stored in different ways:

### JWT Sessions (Recommended for Serverless)

- Session data stored in encrypted token
- No database queries needed to verify session
- Works great with edge functions
- Faster but tokens can't be invalidated immediately

### Database Sessions

- Session data stored in database
- Can be invalidated immediately
- More database queries
- Better for traditional server deployments

## Environment Variables

Store sensitive configuration in `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Never commit `.env.local` to version control!**

## Security Best Practices

### 1. HTTPS Only

Always use HTTPS in production:
- Encrypts data in transit
- Prevents session hijacking
- Required for secure cookies

### 2. Secure Cookie Settings

```typescript
cookies: {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,  // Can't be accessed by JavaScript
      sameSite: 'lax', // CSRF protection
      path: '/',
      secure: true     // HTTPS only
    }
  }
}
```

### 3. CSRF Protection

NextAuth includes CSRF protection by default:
- Validates CSRF tokens on state-changing requests
- Prevents cross-site request forgery attacks

### 4. Rate Limiting

Implement rate limiting to prevent brute force:

```typescript
// Limit login attempts
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Track failed attempts in database or Redis
if (failedAttempts >= MAX_ATTEMPTS) {
  return new Response("Too many attempts. Try again later.", { 
    status: 429 
  });
}
```

### 5. Email Verification

For production, verify email addresses:

```
1. User signs up
2. System sends verification email
3. User clicks link in email
4. Email is marked as verified
5. Only verified users can use app
```

## OAuth Providers (Optional)

Allow users to sign in with existing accounts:

### Google OAuth

```typescript
import GoogleProvider from "next-auth/providers/google";

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })
]
```

### GitHub OAuth

```typescript
import GitHubProvider from "next-auth/providers/github";

providers: [
  GitHubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  })
]
```

Benefits:
- Faster signup process
- No password to remember
- Leverages trusted providers
- Better user experience

## Testing Authentication

### Manual Testing

1. Test registration with invalid data (should fail)
2. Test registration with valid data (should succeed)
3. Test login with wrong password (should fail)
4. Test login with correct credentials (should succeed)
5. Test accessing protected page without login (should redirect)
6. Test accessing protected page with login (should work)
7. Test logout (should clear session)

### Automated Testing

```typescript
// Example test with Playwright
test('user can sign up and log in', async ({ page }) => {
  // Navigate to signup
  await page.goto('/signup');
  
  // Fill form
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'SecurePass123!');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard');
});
```

## Common Pitfalls

### ❌ Don't Do This

```typescript
// Don't trust client-side data
const userId = request.body.userId; // User could fake this!

// Don't expose sensitive data
const user = await getUser(id);
return { user }; // Includes passwordHash!

// Don't skip validation
const password = request.body.password;
// Save directly without validation
```

### ✅ Do This Instead

```typescript
// Always use session user ID
const userId = session.user.id;

// Only return safe data
const { passwordHash, ...safeUser } = user;
return { user: safeUser };

// Always validate
const validatedPassword = passwordSchema.parse(password);
```

## Migration Plan

To implement authentication:

1. Install dependencies: `npm install next-auth bcrypt @types/bcrypt`
2. Create authentication configuration in `lib/auth.ts`
3. Set up API routes in `app/api/auth/[...nextauth]/route.ts`
4. Create login and signup pages
5. Add session provider to root layout
6. Protect all routes that need authentication
7. Add user relationship to database schema
8. Test thoroughly before deploying

## Conclusion

Authentication is the foundation of a secure application. By following these practices, you ensure that user data remains private and the application remains secure.

