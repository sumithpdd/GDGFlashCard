# 🚀 Quick Start Guide

Get up and running with GDG FlashCard in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 20+ installed
- [ ] npm installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Setup Steps

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Set Up Environment Variables

Create `.env.local` file:

```bash
# Clerk Authentication
# Get from: https://dashboard.clerk.com/last-active?path=api-keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_key_here"
CLERK_SECRET_KEY="sk_test_your_key_here"

# Database (we'll set this up later)
DATABASE_URL="postgresql://user:pass@host:5432/db"
```

**Get your Clerk keys:**
1. Visit [Clerk Dashboard](https://dashboard.clerk.com)
2. Create/select your application
3. Go to "API Keys" and copy both keys

> 💡 See [docs/environment-setup.md](./docs/environment-setup.md) for detailed configuration

### 3️⃣ Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## What's Next?

### ✅ Already Complete
- Authentication with Clerk (sign up/sign in working!)
- Landing page with auth UI
- Dark theme enabled

### Phase 1: Database Setup
1. Create Neon account → [neon.tech](https://neon.tech)
2. Follow [docs/drizzle-setup.md](./docs/drizzle-setup.md)
3. Run migrations

### Phase 2: Customize Authentication (Optional)
1. Check [docs/authentication.md](./docs/authentication.md) to:
   - Customize Clerk themes
   - Add OAuth providers (Google, GitHub, etc.)
   - Create custom sign-in pages
   - Learn about protecting routes

### Phase 3: Build Features
1. Create flashcard CRUD operations
2. Implement deck management
3. Build study mode with spaced repetition

## Project Structure

```
GDGFlashCard/
├── src/
│   ├── app/              # Pages & routes
│   ├── components/ui/    # shadcn/ui components
│   ├── lib/              # Utilities
│   └── middleware.ts     # Clerk auth middleware
├── docs/                 # Documentation
├── public/               # Static files
└── package.json          # Dependencies
```

## Key Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Check code quality
```

### Database
```bash
npm run db:push      # Quick sync schema (dev only)
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply migrations to database
npm run db:studio    # Open database GUI
```

> 💡 **Quick Tip:** After modifying your schema in `src/db/schema.ts`, run `npm run db:push` during development to instantly update your database!

## Need Help?

- 📖 [Full Documentation](./docs/README.md)
- 🏗️ [Architecture Guide](./docs/architecture.md)
- 🎓 [Getting Started](./docs/getting-started.md)

## Quick Links

- [Clerk Docs](https://clerk.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Drizzle Docs](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Docs](https://www.typescriptlang.org)

---

**Ready to build?** Check out the [docs folder](./docs) for comprehensive guides! 🚀

