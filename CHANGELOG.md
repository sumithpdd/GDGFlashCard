# Changelog

All notable changes to the GDG FlashCard project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Updated font family from Geist to Poppins (Google Fonts) - 2025-11-01
  - Configured multiple font weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi Bold), 700 (Bold)
  - Updated `src/app/layout.tsx` with Poppins font configuration
  - Updated `src/app/globals.css` to use Poppins exclusively
  - Removed all Geist font references (both sans and mono)
  - Applied Poppins globally via `font-sans` Tailwind utility
  - Font available via CSS variable `--font-poppins`
  
- Updated project metadata - 2025-11-01
  - Changed title from "Create Next App" to "GDG FlashCard"
  - Updated description to "Interactive flashcard system for Google Developer Groups"

### Added
- Created CHANGELOG.md to track project changes - 2025-11-01
- Created FONT_VERIFICATION.md with comprehensive font audit - 2025-11-01
- Updated README.md with "Customizations Applied" section - 2025-11-01
- Updated development roadmap in README.md - 2025-11-01

### Removed
- Removed Geist Sans font from `src/app/layout.tsx` - 2025-11-01
- Removed Geist Mono font from `src/app/layout.tsx` - 2025-11-01
- Removed `--font-mono` CSS variable from `src/app/globals.css` - 2025-11-01
- Removed all Geist font references from codebase - 2025-11-01

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

