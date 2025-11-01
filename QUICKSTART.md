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
# Database (we'll set this up later)
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Auth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-here"

# App URL
NEXTAUTH_URL="http://localhost:3000"
```

> 💡 See [docs/environment-setup.md](./docs/environment-setup.md) for detailed configuration

### 3️⃣ Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## What's Next?

### Phase 1: Database Setup
1. Create Neon account → [neon.tech](https://neon.tech)
2. Follow [docs/drizzle-setup.md](./docs/drizzle-setup.md)
3. Run migrations

### Phase 2: Authentication
1. Follow [docs/authentication.md](./docs/authentication.md)
2. Create login/signup pages
3. Protect routes

### Phase 3: Build Features
1. Create flashcard CRUD
2. Implement deck management
3. Build study mode

## Project Structure

```
GDGFlashCard/
├── src/app/          # Pages & routes
├── docs/             # Documentation
├── public/           # Static files
└── package.json      # Dependencies
```

## Key Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Check code quality
```

## Need Help?

- 📖 [Full Documentation](./docs/README.md)
- 🏗️ [Architecture Guide](./docs/architecture.md)
- 🎓 [Getting Started](./docs/getting-started.md)

## Quick Links

- [Next.js Docs](https://nextjs.org/docs)
- [Drizzle Docs](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Docs](https://www.typescriptlang.org)

---

**Ready to build?** Check out the [docs folder](./docs) for comprehensive guides! 🚀

