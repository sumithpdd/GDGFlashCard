# Changelog

All notable changes to the GDG FlashCard project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Authentication (2025-11-01)
- Integrated Clerk authentication system
  - Installed `@clerk/nextjs@latest` package
  - Installed `@clerk/themes` for dark mode support
  - Created `src/middleware.ts` with `clerkMiddleware()` for route protection
  - Wrapped application with `<ClerkProvider>` in `src/app/layout.tsx`
  - Enabled dark theme throughout all Clerk UI components
  - Added authentication UI to header with Sign In/Sign Up buttons and UserButton

#### UI Components (2025-11-01)
- Integrated shadcn/ui component library
  - Installed shadcn/ui Button component (`src/components/ui/button.tsx`)
  - Created utility functions in `src/lib/utils.ts`
  - Applied Button components to authentication UI for consistent styling

#### Landing Page (2025-11-01)
- Created modern landing page in `src/app/page.tsx`
  - Welcome hero section with "GDG FlashCard" branding
  - Call-to-action section prompting users to sign up
  - Responsive design with Tailwind CSS
  - Dark theme styling

### Changed

#### Documentation (2025-11-01)
- Completely rewrote `docs/authentication.md` to reflect Clerk implementation
  - Removed all NextAuth.js references
  - Added comprehensive Clerk integration guide
  - Documented authentication flow, session management, and security features
  - Added code examples for server components, API routes, and client components
  - Included customization, OAuth provider setup, and troubleshooting guides

- Updated `docs/environment-setup.md`
  - Replaced NextAuth environment variables with Clerk keys
  - Added `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` documentation
  - Updated OAuth provider section to reflect Clerk's dashboard-based setup
  - Updated environment variable validation examples

- Updated `docs/getting-started.md`
  - Added Clerk API key setup instructions
  - Simplified authentication setup (already implemented)
  - Updated Next Steps to reflect completed authentication

- Updated `README.md`
  - Changed tech stack to include Clerk and shadcn/ui
  - Added Authentication section to "Customizations Applied"
  - Added UI Components section
  - Updated project structure to show middleware and components
  - Updated installation instructions with Clerk environment variables
  - Marked authentication tasks as complete in roadmap

#### Font Changes (2025-11-01)
- Updated font family from Geist to Poppins (Google Fonts)
  - Configured multiple font weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi Bold), 700 (Bold)
  - Updated `src/app/layout.tsx` with Poppins font configuration
  - Updated `src/app/globals.css` to use Poppins exclusively
  - Removed all Geist font references (both sans and mono)
  - Applied Poppins globally via `font-sans` Tailwind utility
  - Font available via CSS variable `--font-poppins`
  
- Updated project metadata
  - Changed title from "Create Next App" to "GDG FlashCard"
  - Updated description to "Interactive flashcard system for Google Developer Groups"

### Removed
- Removed Geist Sans font from `src/app/layout.tsx` - 2025-11-01
- Removed Geist Mono font from `src/app/layout.tsx` - 2025-11-01
- Removed `--font-mono` CSS variable from `src/app/globals.css` - 2025-11-01
- Removed all Geist font references from codebase - 2025-11-01
- Removed all NextAuth.js references from documentation - 2025-11-01

## [0.1.0] - 2025-11-01

### Added
- Initial Next.js 16 project setup with TypeScript
- React 19 integration
- Tailwind CSS v4 configuration
- Project documentation structure
- README.md with project overview and architecture
- Comprehensive documentation in `docs/` folder
- ESLint configuration

### Infrastructure
- Next.js App Router structure
- TypeScript strict mode enabled
- Basic project structure with `src/app` directory
- Global styles with Tailwind CSS

---

## Version History

- **[Unreleased]** - Current development
- **[0.1.0]** - Initial project setup (2025-11-01)

