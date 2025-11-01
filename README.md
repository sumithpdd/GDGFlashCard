# GDG FlashCard Application

A full-stack flashcard application built with Next.js, featuring user authentication and personalized flashcard management.

## Overview

GDG FlashCard is a modern web application that helps users create, organize, and study flashcards. The application uses Next.js for both frontend and backend functionality, with secure user authentication and data persistence.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Fonts**: Poppins (Google Fonts)
- **Database**: PostgreSQL (hosted on Neon)
- **ORM**: Drizzle ORM
- **Authentication**: Clerk (with dark theme)

## Architecture

This is a full-stack application with:
- **Client-side code**: React components that run in the user's browser
- **Server-side code**: API routes and server components that handle business logic
- **Database layer**: PostgreSQL database accessed through Drizzle ORM

### How It Works

1. **User Interaction**: Users interact with the application through their web browser
2. **Form Submission**: When users create flashcards or perform actions, data is sent to the server
3. **Authentication Check**: The server verifies the user is logged in
4. **Database Operations**: Authenticated requests are processed through Drizzle ORM
5. **Data Persistence**: Drizzle communicates with the PostgreSQL database on Neon

### Why Drizzle ORM?

- **Type Safety**: Provides TypeScript types that match your database schema
- **Schema Definition**: Clearly defines database structure in code
- **AI-Friendly**: Makes it easy for Cursor AI to understand and work with your database
- **Developer Experience**: Reduces errors and improves code completion

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn package manager
- A Neon account for PostgreSQL database (to be set up)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Database
DATABASE_URL=secret
```

Get your Clerk keys from [https://dashboard.clerk.com/last-active?path=api-keys](https://dashboard.clerk.com/last-active?path=api-keys)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

The project uses Drizzle ORM with a PostgreSQL database hosted on Neon.

### Database Scripts

- `npm run db:push` - Quick sync schema to database (development only)
- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Apply migrations to the database
- `npm run db:studio` - Open Drizzle Studio GUI to view and edit data

### Updating Your Database Schema

After modifying `src/db/schema.ts`, you need to sync those changes to your Neon database:

#### For Development (Quick & Easy)
```bash
npm run db:push
```
**Use when:** Making quick changes locally, prototyping, or testing new schemas.

#### For Production (Version Controlled)
```bash
# 1. Generate migration files
npm run db:generate

# 2. Review the generated SQL in drizzle/ folder

# 3. Apply migrations
npm run db:migrate
```
**Use when:** Deploying to production, working with a team, or need version history.

#### Viewing Your Database
```bash
npm run db:studio
```
Opens Drizzle Studio at `https://local.drizzle.studio` to visually browse and manage your data.

> 💡 **For detailed workflows and examples, see [docs/drizzle-setup.md](./docs/drizzle-setup.md)**

### Database Structure

- **Connection**: `src/db/index.ts` - Database connection and Drizzle instance
- **Schema**: `src/db/schema.ts` - Define tables and relationships
- **Config**: `drizzle.config.ts` - Drizzle Kit configuration

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

## Customizations Applied

### Authentication
- **Provider**: [Clerk](https://clerk.com) for complete user authentication
- **Features**: Sign up, sign in, user management, session handling
- **Theme**: Dark mode enabled via `@clerk/themes`
- **Components**: Using shadcn/ui Button components for auth UI
- **Implementation**: 
  - `ClerkProvider` wraps the app in `src/app/layout.tsx`
  - Middleware protection in `src/middleware.ts`
  - Dark theme applied throughout Clerk UI

### Typography
- **Font Family**: Replaced default Geist fonts with [Poppins](https://fonts.google.com/specimen/Poppins) from Google Fonts
- **Font Weights**: Configured with 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi Bold), and 700 (Bold)
- **CSS Variable**: Available as `--font-poppins` throughout the application
- **Implementation**: 
  - Font imported in `src/app/layout.tsx`
  - Global configuration in `src/app/globals.css`
  - Applied site-wide via `font-sans` Tailwind utility
- **Verification**: See [FONT_VERIFICATION.md](./FONT_VERIFICATION.md) for complete audit

### UI Components
- **Library**: shadcn/ui for consistent, accessible components
- **Components Installed**: Button
- **Theme**: Dark mode with custom styling

### Metadata
- **Title**: Changed from "Create Next App" to "GDG FlashCard"
- **Description**: Updated to "Interactive flashcard system for Google Developer Groups"

## Project Structure

```
GDGFlashCard/
├── src/
│   ├── app/                    # Next.js App Router pages and layouts
│   │   ├── layout.tsx          # Root layout with ClerkProvider
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   └── ui/                 # shadcn/ui components
│   │       └── button.tsx      # Button component
│   ├── db/                     # Database layer
│   │   ├── index.ts            # Database connection
│   │   └── schema.ts           # Database schema
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   └── middleware.ts           # Clerk authentication middleware
├── public/                     # Static assets
├── docs/                       # Documentation
├── drizzle/                    # Database migrations (generated)
├── drizzle.config.ts           # Drizzle Kit configuration
├── .env.local                  # Environment variables (not committed)
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Security Considerations

This application implements the following security measures:

- **Authentication Required**: Only logged-in users can access the application
- **Data Isolation**: Users can only access their own flashcards
- **Server-Side Validation**: All data operations are validated on the server
- **Secure Database Access**: Database credentials are stored in environment variables

## Documentation

For more detailed information, see the [docs](./docs) folder:

- [Architecture](./docs/architecture.md) - Detailed system architecture
- [Database Schema](./docs/database.md) - Database structure and models
- [Authentication](./docs/authentication.md) - Authentication implementation
- [Font Verification](./FONT_VERIFICATION.md) - Complete font configuration audit
- [CHANGELOG](./CHANGELOG.md) - Project change history and version tracking

## Development Roadmap

- [x] Initialize Next.js project with TypeScript
- [x] Configure Poppins font with multiple weights (300-700)
- [x] Update project metadata (title, description)
- [x] Implement Clerk authentication with dark theme
- [x] Install shadcn/ui components (Button)
- [x] Create landing page with auth UI
- [x] Set up Drizzle ORM
- [x] Configure Neon PostgreSQL database
- [ ] Define flashcard database schema
- [ ] Create flashcard CRUD operations
- [ ] Build study mode interface
- [ ] Add spaced repetition algorithm

## Contributing

This is a learning project. Feel free to fork and experiment!

## License

See [LICENSE](./LICENSE) file for details.
