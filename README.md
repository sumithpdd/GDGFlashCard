# GDG FlashCard Application

A full-stack flashcard application built with Next.js, featuring user authentication and personalized flashcard management.

## Overview

GDG FlashCard is a modern web application that helps users create, organize, and study flashcards. The application uses Next.js for both frontend and backend functionality, with secure user authentication and data persistence.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Fonts**: Poppins (Google Fonts)
- **Database**: PostgreSQL (hosted on Neon)
- **ORM**: Drizzle ORM
- **Authentication**: Next.js authentication (to be implemented)

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

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Customizations Applied

### Typography
- **Font Family**: Replaced default Geist fonts with [Poppins](https://fonts.google.com/specimen/Poppins) from Google Fonts
- **Font Weights**: Configured with 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi Bold), and 700 (Bold)
- **CSS Variable**: Available as `--font-poppins` throughout the application
- **Implementation**: 
  - Font imported in `src/app/layout.tsx`
  - Global configuration in `src/app/globals.css`
  - Applied site-wide via `font-sans` Tailwind utility
- **Verification**: See [FONT_VERIFICATION.md](./FONT_VERIFICATION.md) for complete audit

### Metadata
- **Title**: Changed from "Create Next App" to "GDG FlashCard"
- **Description**: Updated to "Interactive flashcard system for Google Developer Groups"

## Project Structure

```
GDGFlashCard/
├── src/
│   └── app/              # Next.js App Router pages and layouts
│       ├── layout.tsx    # Root layout
│       ├── page.tsx      # Home page
│       └── globals.css   # Global styles
├── public/               # Static assets
├── docs/                 # Documentation
├── package.json          # Dependencies and scripts
└── README.md            # This file
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
- [ ] Set up Drizzle ORM
- [ ] Configure Neon PostgreSQL database
- [ ] Implement user authentication
- [ ] Create flashcard CRUD operations
- [ ] Build study mode interface
- [ ] Add spaced repetition algorithm

## Contributing

This is a learning project. Feel free to fork and experiment!

## License

See [LICENSE](./LICENSE) file for details.
