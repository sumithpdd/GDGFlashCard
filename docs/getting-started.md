# Getting Started Guide

Welcome to GDG FlashCard! This guide will walk you through setting up the project for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20.0.0 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`

- **npm**: Comes with Node.js
  - Verify: `npm --version`

- **Git**: For version control
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify: `git --version`

- **A Code Editor**: We recommend VS Code with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

## Step-by-Step Setup

### 1. Clone the Repository

If you haven't already:

```bash
git clone <repository-url>
cd GDGFlashCard
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Next.js framework
- React and React DOM
- TypeScript
- Tailwind CSS
- ESLint
- And all other dependencies

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following content:

```bash
# Clerk Authentication
# Get these from: https://dashboard.clerk.com/last-active?path=api-keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_publishable_key_here"
CLERK_SECRET_KEY="your_secret_key_here"

# Database Connection (we'll set this up later)
DATABASE_URL="postgresql://user:password@host:5432/database"
```

**How to get your Clerk keys:**

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application (or select existing)
3. Navigate to "API Keys"
4. Copy both the "Publishable key" and "Secret key"
5. Paste them into your `.env.local` file

**Important:**
- Keep the `NEXT_PUBLIC_` prefix for the publishable key
- Never commit `.env.local` to version control
- The publishable key is safe for the browser, the secret key is not

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the Next.js welcome page!

### 5. Verify the Setup

Check that everything is working:

1. **TypeScript**: Open any `.tsx` file and verify syntax highlighting works
2. **Hot Reload**: Edit `src/app/page.tsx` and save - changes should appear immediately
3. **Tailwind CSS**: The page should be styled
4. **No Errors**: Check the terminal and browser console for errors

## Project Structure

Here's what each file and folder does:

```
GDGFlashCard/
├── src/
│   └── app/                  # Next.js App Router
│       ├── layout.tsx        # Root layout (wraps all pages)
│       ├── page.tsx          # Home page (/)
│       ├── globals.css       # Global styles
│       └── favicon.ico       # Site icon
│
├── public/                   # Static files (images, fonts, etc.)
│   ├── next.svg             # Next.js logo
│   └── vercel.svg           # Vercel logo
│
├── docs/                     # Documentation (you are here!)
│   ├── getting-started.md   # This file
│   ├── architecture.md      # System architecture
│   ├── database.md          # Database schema
│   └── authentication.md    # Auth implementation
│
├── .env.local               # Environment variables (DO NOT COMMIT)
├── .env.example             # Example environment file
├── .gitignore               # Files Git should ignore
├── eslint.config.mjs        # ESLint configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
├── postcss.config.mjs       # PostCSS configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project overview
```

## Next Steps

Now that your development environment is set up:

### 1. Set Up the Database

Follow the [Database Setup Guide](./database-setup.md) to:
- Create a Neon PostgreSQL database
- Install Drizzle ORM
- Create database schema
- Run migrations

### 2. Customize Authentication (Optional)

Authentication is already set up with Clerk! But you can customize:
- [Authentication Guide](./authentication.md) to learn more about:
  - Customizing Clerk themes
  - Creating custom sign-in/sign-up pages
  - Protecting specific routes
  - Working with user data
  - Adding OAuth providers

### 3. Build Features

Start building the core features:
- Create flashcard CRUD operations
- Implement deck organization
- Add study mode
- Track progress

## Available Scripts

- **`npm run dev`**: Start development server (port 3000)
- **`npm run build`**: Build for production
- **`npm start`**: Start production server
- **`npm run lint`**: Check code quality with ESLint
- **`npm run lint:fix`**: Auto-fix ESLint issues

## Development Workflow

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes** in the appropriate files

3. **Test your changes:**
   - Check in browser
   - Run `npm run lint`
   - Fix any TypeScript errors

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add my new feature"
   ```

5. **Push to repository:**
   ```bash
   git push origin feature/my-new-feature
   ```

### File Naming Conventions

- **Components**: PascalCase - `UserProfile.tsx`
- **Pages**: kebab-case - `edit-flashcard/page.tsx`
- **Utilities**: camelCase - `formatDate.ts`
- **Types**: PascalCase - `User.types.ts`

### Code Style

This project uses:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting (optional but recommended)

ESLint will catch most issues automatically.

## Common Issues

### Port Already in Use

If port 3000 is already in use:

```bash
# Find and kill the process (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Module Not Found

If you see "Module not found" errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

If you see TypeScript errors:

```bash
# Check your TypeScript version
npx tsc --version

# Restart your editor's TypeScript server
# In VS Code: Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server"
```

### Hot Reload Not Working

If changes aren't appearing:

1. Stop the dev server (Ctrl+C)
2. Delete `.next` folder
3. Restart: `npm run dev`

## Getting Help

- **Documentation**: Check the `docs/` folder
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **React Docs**: [react.dev](https://react.dev)
- **TypeScript Docs**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)
- **Tailwind CSS Docs**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

## VS Code Recommended Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Ready to Build!

You're all set! Start by exploring the codebase:

1. Look at `src/app/page.tsx` - the home page
2. Check `src/app/layout.tsx` - the root layout
3. Read through the docs in `docs/` folder
4. Start building features!

Happy coding! 🚀

