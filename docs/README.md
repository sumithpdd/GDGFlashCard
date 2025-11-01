# Documentation Index

Welcome to the GDG FlashCard documentation! This folder contains comprehensive guides to help you understand and work with this project.

## 📚 Documentation Structure

### Getting Started
- **[Getting Started Guide](./getting-started.md)** - Start here! Complete setup instructions for new developers

### Architecture & Design
- **[Architecture Overview](./architecture.md)** - How the full-stack application works
- **[Database Schema](./database.md)** - Database structure and relationships

### Implementation Guides
- **[Drizzle ORM Setup](./drizzle-setup.md)** - Setting up the database layer
- **[Authentication](./authentication.md)** - User authentication and authorization
- **[Environment Setup](./environment-setup.md)** - Configuring environment variables

## 🚀 Quick Start Path

Follow these documents in order:

1. **[Getting Started](./getting-started.md)** - Set up your development environment
2. **[Environment Setup](./environment-setup.md)** - Configure environment variables
3. **[Drizzle Setup](./drizzle-setup.md)** - Set up database and ORM
4. **[Authentication](./authentication.md)** - Implement user authentication

Then read the architecture docs to understand the system:

5. **[Architecture](./architecture.md)** - Understand the full-stack flow
6. **[Database Schema](./database.md)** - Learn the data model

## 📖 Document Summaries

### Getting Started Guide
**For:** New developers  
**Topics:**
- Installing prerequisites
- Project setup
- Running the development server
- Understanding project structure
- Common issues and solutions

### Architecture Overview
**For:** Understanding the system design  
**Topics:**
- Full-stack architecture
- Frontend, backend, and database layers
- Request/response flow
- Security considerations
- Why we chose these technologies

### Database Schema
**For:** Working with data  
**Topics:**
- PostgreSQL and Neon setup
- Table definitions (Users, Flashcards, Decks, Study Sessions)
- Relationships and foreign keys
- Query examples
- Best practices for data security

### Drizzle ORM Setup
**For:** Database implementation  
**Topics:**
- Installing Drizzle ORM
- Defining schemas in TypeScript
- Running migrations
- Writing type-safe queries
- Using Drizzle Studio

### Authentication
**For:** User management and security  
**Topics:**
- Authentication vs Authorization
- NextAuth.js setup
- Password hashing with bcrypt
- Protecting routes and API endpoints
- Session management
- OAuth providers (Google, GitHub)

### Environment Setup
**For:** Configuration management  
**Topics:**
- Creating .env.local file
- Required environment variables
- OAuth provider setup
- Security best practices
- Deployment configuration

## 🎯 Documentation by Role

### I'm a Frontend Developer
Start with:
1. [Getting Started](./getting-started.md) - Set up your environment
2. [Architecture](./architecture.md) - Understand how frontend connects to backend
3. [Authentication](./authentication.md) - Learn about session management

You'll mostly work in:
- `src/app/` - Pages and layouts
- `src/components/` - React components (create this)
- `src/lib/` - Utility functions (create this)

### I'm a Backend Developer
Start with:
1. [Getting Started](./getting-started.md) - Set up your environment
2. [Drizzle Setup](./drizzle-setup.md) - Database layer
3. [Database Schema](./database.md) - Data models
4. [Authentication](./authentication.md) - API security

You'll mostly work in:
- `src/app/api/` - API routes (create this)
- `src/db/` - Database schema and queries (create this)
- `src/lib/auth.ts` - Authentication config (create this)

### I'm a Full-Stack Developer
Read all docs in the Quick Start order above. You'll work across the entire codebase.

### I'm a DevOps Engineer
Focus on:
1. [Environment Setup](./environment-setup.md) - Configuration
2. [Drizzle Setup](./drizzle-setup.md) - Database deployment
3. [Architecture](./architecture.md) - System overview

## 🛠️ Technology Stack

This project uses:

| Technology | Purpose | Documentation |
|------------|---------|---------------|
| **Next.js 16** | Full-stack framework | [nextjs.org/docs](https://nextjs.org/docs) |
| **React 19** | UI library | [react.dev](https://react.dev) |
| **TypeScript** | Type safety | [typescriptlang.org](https://www.typescriptlang.org/) |
| **Tailwind CSS 4** | Styling | [tailwindcss.com](https://tailwindcss.com/) |
| **Drizzle ORM** | Database toolkit | [orm.drizzle.team](https://orm.drizzle.team/) |
| **PostgreSQL** | Database | [postgresql.org](https://www.postgresql.org/) |
| **Neon** | Database hosting | [neon.tech/docs](https://neon.tech/docs) |
| **NextAuth.js** | Authentication | [next-auth.js.org](https://next-auth.js.org/) |

## 📝 Key Concepts

### Full-Stack Architecture
Next.js provides both frontend and backend in one framework. Client code runs in the browser, server code runs on Node.js.

### Type Safety
TypeScript catches errors before runtime. Drizzle provides types that match your database schema exactly.

### Server Components
The default in Next.js App Router. Components that fetch data on the server, reducing client bundle size.

### API Routes
Backend endpoints in `src/app/api/`. Handle business logic, authentication, and database operations.

### ORM (Object-Relational Mapping)
Drizzle translates TypeScript code into SQL queries, providing type safety and preventing SQL injection.

## 🔒 Security Principles

This application follows security best practices:

1. **Authentication Required** - Only logged-in users can access features
2. **Data Isolation** - Users can only access their own data
3. **Server-Side Validation** - Never trust client data
4. **Password Hashing** - Passwords are encrypted with bcrypt
5. **Environment Variables** - Secrets never in code
6. **SQL Injection Prevention** - Drizzle uses prepared statements

Read more in [Authentication](./authentication.md).

## 🏗️ Project Structure

```
GDGFlashCard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes (to be created)
│   │   ├── (auth)/            # Auth pages (to be created)
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── dashboard/         # Protected pages (to be created)
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components (to be created)
│   │   ├── ui/               # Reusable UI components
│   │   └── features/         # Feature-specific components
│   │
│   ├── db/                    # Database (to be created)
│   │   ├── schema.ts         # Drizzle schema
│   │   └── client.ts         # Database client
│   │
│   └── lib/                   # Utilities (to be created)
│       ├── auth.ts           # NextAuth config
│       └── utils.ts          # Helper functions
│
├── public/                    # Static assets
├── docs/                      # Documentation (you are here!)
├── drizzle/                   # Generated migrations (to be created)
├── .env.local                 # Environment variables (to be created)
├── package.json               # Dependencies
└── README.md                  # Project overview
```

## 🎓 Learning Resources

### Video Tutorials
- [Next.js 15 Crash Course](https://www.youtube.com/watch?v=Sklc_fQBmcs) by Traversy Media
- [TypeScript for Beginners](https://www.youtube.com/watch?v=BwuLxPH8IDs) by Programming with Mosh
- [Drizzle ORM Tutorial](https://www.youtube.com/watch?v=i6VnBdT1jP8) by Web Dev Simplified

### Written Tutorials
- [Next.js Tutorial](https://nextjs.org/learn) - Official Next.js tutorial
- [React Documentation](https://react.dev/learn) - Official React docs
- [Drizzle ORM Guide](https://orm.drizzle.team/docs/get-started-postgresql) - Official Drizzle docs

### Community
- [Next.js Discord](https://nextjs.org/discord)
- [Reactiflux Discord](https://www.reactiflux.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

## 🤝 Contributing

When adding new features:

1. Update relevant documentation
2. Add code comments for complex logic
3. Create new docs for major features
4. Keep the README.md updated

## 📞 Getting Help

If you're stuck:

1. Check the relevant documentation above
2. Search for error messages in [Stack Overflow](https://stackoverflow.com/)
3. Read official documentation for the specific technology
4. Ask in the project's discussion forum or chat

## 🗺️ Roadmap

Documentation to be added:

- [ ] Deployment Guide
- [ ] Testing Guide
- [ ] API Reference
- [ ] Component Library
- [ ] Performance Optimization
- [ ] Troubleshooting Guide

## ✅ Documentation Checklist

When implementing features, ensure:

- [ ] Code is documented with comments
- [ ] New features are added to relevant docs
- [ ] Examples are provided
- [ ] Security considerations are noted
- [ ] README.md is updated

## 📄 Documentation Standards

When writing docs:

- Use clear, simple language
- Provide code examples
- Explain *why*, not just *how*
- Include visual diagrams where helpful
- Link to related documentation
- Test all code examples

## 🎉 Ready to Start?

Begin with the [Getting Started Guide](./getting-started.md) and follow the Quick Start path above!

Happy coding! 🚀

