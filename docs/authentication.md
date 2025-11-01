# Authentication Documentation

## Overview

This application uses [Clerk](https://clerk.com) for complete user authentication and session management. Clerk provides a modern, secure authentication solution with built-in UI components and comprehensive user management.

## Why Clerk?

Clerk was chosen for this application because it provides:

1. **Complete Authentication Solution**: Sign up, sign in, password reset, email verification
2. **Beautiful Pre-built UI**: Customizable components that match your app's design
3. **Multiple Auth Methods**: Email/password, social OAuth (Google, GitHub, etc.)
4. **Session Management**: Automatic session handling and token refresh
5. **User Management**: Built-in user profile management and account settings
6. **Security**: Industry-standard security practices built-in
7. **Next.js Integration**: First-class support for Next.js App Router
8. **Developer Experience**: Simple API, great documentation, TypeScript support

## Tech Stack

- **Package**: `@clerk/nextjs@latest`
- **Theme Package**: `@clerk/themes` (for dark mode)
- **UI Components**: shadcn/ui Button components for custom styling
- **Middleware**: `clerkMiddleware()` for route protection

## How It Works

### Authentication Flow

```
1. User visits your application
2. User clicks "Sign Up" or "Sign In" button
3. Clerk modal/page appears with authentication form
4. User enters credentials or signs in with OAuth provider
5. Clerk handles:
   - Input validation
   - Password hashing and security
   - Email verification (if enabled)
   - Session creation
6. User is automatically signed in
7. Middleware validates session on each request
8. User can access protected routes
```

### Session Management

Clerk automatically handles:
- **Session Creation**: When user signs in
- **Session Storage**: Secure HTTP-only cookies
- **Session Validation**: On every request via middleware
- **Token Refresh**: Automatic token renewal
- **Session Termination**: When user signs out

## Implementation

### 1. Package Installation

```bash
npm install @clerk/nextjs @clerk/themes
```

### 2. Environment Variables

Add to `.env.local`:

```bash
# Get these from https://dashboard.clerk.com/last-active?path=api-keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Important:**
- The `NEXT_PUBLIC_` prefix makes the publishable key available to the client
- The secret key is server-only and never exposed to the browser
- Never commit these keys to version control

### 3. Middleware Configuration

Create `src/middleware.ts`:

```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
```

**What this does:**
- Runs on every request to your application
- Validates user sessions automatically
- Protects routes based on authentication status
- Makes user data available in your app

### 4. Root Layout Setup

Update `src/app/layout.tsx`:

```typescript
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

**Key points:**
- `ClerkProvider` must wrap your entire application
- `dark` theme from `@clerk/themes` enables dark mode
- All Clerk components inherit this theme

### 5. Authentication UI Components

Clerk provides ready-to-use components:

```typescript
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header>
      <SignedOut>
        {/* Show when user is NOT signed in */}
        <SignInButton mode="modal">
          <Button variant="ghost">Sign In</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button>Sign Up</Button>
        </SignUpButton>
      </SignedOut>
      
      <SignedIn>
        {/* Show when user IS signed in */}
        <UserButton />
      </SignedIn>
    </header>
  );
}
```

**Component Options:**

- **`<SignInButton>`**: Opens sign-in flow
  - `mode="modal"`: Opens in a modal overlay
  - `mode="redirect"`: Navigates to `/sign-in`
  
- **`<SignUpButton>`**: Opens sign-up flow
  - Same modes as SignInButton
  
- **`<UserButton>`**: Shows user avatar with dropdown menu
  - Includes profile, settings, sign out
  - Fully customizable appearance
  
- **`<SignedIn>`**: Conditionally render content for authenticated users
  
- **`<SignedOut>`**: Conditionally render content for unauthenticated users

## Accessing User Data

### Server Components

```typescript
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  // Get user ID and session info
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  // Get full user object
  const user = await currentUser();
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Email: {user?.emailAddresses[0]?.emailAddress}</p>
    </div>
  );
}
```

### API Routes

```typescript
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // User is authenticated
  const data = await request.json();
  
  // Create resource for this user
  const flashcard = await db.insert(flashcards).values({
    userId,
    ...data,
  });
  
  return Response.json(flashcard);
}
```

### Client Components

```typescript
"use client";

import { useUser } from "@clerk/nextjs";

export function ProfileCard() {
  const { isLoaded, isSignedIn, user } = useUser();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }
  
  return (
    <div>
      <h2>{user.firstName} {user.lastName}</h2>
      <p>{user.emailAddresses[0].emailAddress}</p>
    </div>
  );
}
```

## Route Protection

### Protecting Entire Routes

Update `src/middleware.ts` to protect specific routes:

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/flashcards(.*)',
  '/api/flashcards(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

### Protecting Individual Pages

For server components:

```typescript
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  return <div>Protected content</div>;
}
```

## Authorization (Checking Ownership)

Always verify users can only access their own data:

```typescript
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { flashcards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Get the flashcard
  const flashcard = await db
    .select()
    .from(flashcards)
    .where(eq(flashcards.id, params.id))
    .limit(1);
  
  // Check if user owns this flashcard
  if (!flashcard || flashcard[0].userId !== userId) {
    return new Response("Forbidden", { status: 403 });
  }
  
  // User owns it, allow deletion
  await db.delete(flashcards).where(eq(flashcards.id, params.id));
  
  return new Response("Deleted", { status: 200 });
}
```

## Customization

### Theme Customization

```typescript
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

<ClerkProvider
  appearance={{
    baseTheme: dark,
    variables: {
      colorPrimary: "#3b82f6", // Custom primary color
      colorBackground: "#000000", // Background color
      colorText: "#ffffff", // Text color
    },
    elements: {
      formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
      card: "bg-gray-900 border border-gray-800",
    },
  }}
>
  {children}
</ClerkProvider>
```

### Custom Sign-In/Sign-Up Pages

Create custom pages if you want more control:

```typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  );
}
```

## User Data Structure

Clerk provides rich user data:

```typescript
{
  id: "user_xxxxx",
  firstName: "John",
  lastName: "Doe",
  emailAddresses: [
    {
      id: "email_xxxxx",
      emailAddress: "john@example.com",
      verification: {
        status: "verified"
      }
    }
  ],
  imageUrl: "https://...",
  createdAt: 1234567890,
  updatedAt: 1234567890,
}
```

## OAuth Providers (Social Sign-In)

Enable OAuth providers in your Clerk Dashboard:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to "Social Login"
4. Enable providers (Google, GitHub, Microsoft, etc.)
5. Configure OAuth credentials
6. Save changes

No code changes needed - Clerk handles everything!

## Security Features

Clerk includes:

1. **Password Security**
   - Industry-standard hashing (bcrypt)
   - Password strength requirements
   - Breach detection

2. **Session Security**
   - HTTP-only cookies
   - Automatic token rotation
   - Device fingerprinting
   - Session duration limits

3. **Attack Prevention**
   - Rate limiting on auth endpoints
   - CSRF protection
   - Bot detection
   - Brute force protection

4. **Email Verification**
   - Optional or required email verification
   - Magic link sign-in
   - One-time passwords (OTP)

5. **Multi-Factor Authentication**
   - SMS verification
   - Authenticator apps (TOTP)
   - Backup codes

## Testing Authentication

### Manual Testing

1. **Sign Up Flow**
   - Click "Sign Up"
   - Enter email and password
   - Verify email (if enabled)
   - Should redirect to app

2. **Sign In Flow**
   - Click "Sign In"
   - Enter credentials
   - Should redirect to app
   - Should see UserButton

3. **Protected Routes**
   - Try accessing `/dashboard` without signing in
   - Should redirect to sign-in
   - Sign in and try again
   - Should see dashboard

4. **Sign Out**
   - Click UserButton
   - Click "Sign Out"
   - Should clear session
   - Protected routes should be blocked again

### Programmatic Testing

```typescript
// Example with Playwright
import { test, expect } from '@playwright/test';

test('user can sign up and access dashboard', async ({ page }) => {
  await page.goto('/');
  
  // Click sign up
  await page.click('text=Sign Up');
  
  // Fill form (in Clerk modal)
  await page.fill('input[name="emailAddress"]', 'test@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Should be signed in and redirected
  await expect(page).toHaveURL('/dashboard');
  
  // Should see user button
  await expect(page.locator('[data-clerk-user-button]')).toBeVisible();
});
```

## Best Practices

### ✅ Do This

```typescript
// Always use userId from auth()
const { userId } = await auth();

// Check authentication before operations
if (!userId) {
  return new Response("Unauthorized", { status: 401 });
}

// Verify ownership
if (resource.userId !== userId) {
  return new Response("Forbidden", { status: 403 });
}

// Only expose safe user data
const { firstName, emailAddress } = user;
```

### ❌ Don't Do This

```typescript
// Don't trust client-side user IDs
const userId = request.body.userId; // User can fake this!

// Don't skip auth checks
const flashcard = await getFlashcard(id);
// ... use flashcard without checking ownership

// Don't expose sensitive data
return { user }; // May include sensitive data
```

## Troubleshooting

### "Invalid publishable key"

**Problem:** Clerk can't validate your publishable key

**Solution:**
1. Check key starts with `pk_test_` or `pk_live_`
2. Verify key is in `.env.local`
3. Restart dev server
4. Check for typos

### Middleware not protecting routes

**Problem:** Can access protected routes without signing in

**Solution:**
1. Verify `middleware.ts` is in correct location (`src/middleware.ts`)
2. Check middleware matcher configuration
3. Ensure `clerkMiddleware()` is exported as default
4. Restart dev server

### User button not showing

**Problem:** `<UserButton>` not appearing when signed in

**Solution:**
1. Verify inside `<SignedIn>` component
2. Check Clerk provider wraps the component
3. Ensure user is actually signed in
4. Check browser console for errors

### Dark theme not applying

**Problem:** Clerk components showing light theme

**Solution:**
1. Verify `@clerk/themes` is installed
2. Check `dark` is imported and passed to `baseTheme`
3. Clear browser cache
4. Check for custom appearance overrides

## Production Checklist

Before deploying:

- [ ] Set production Clerk keys in hosting environment
- [ ] Use `pk_live_` and `sk_live_` keys (not test keys)
- [ ] Enable email verification
- [ ] Configure custom domain (optional)
- [ ] Set up webhook endpoints (for user events)
- [ ] Test sign-up and sign-in flows in production
- [ ] Verify protected routes work correctly
- [ ] Test sign-out functionality
- [ ] Check error handling

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Component Reference](https://clerk.com/docs/components/overview)
- [Clerk Dashboard](https://dashboard.clerk.com)

## Conclusion

Clerk provides a complete, production-ready authentication solution with minimal code. The implementation is secure, scalable, and provides an excellent user experience with built-in dark mode support and customizable UI components.
