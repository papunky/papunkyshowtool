# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based radio show management tool for KXLU 88.9 FM called "papunky". The application helps radio DJs prepare for shows by uploading playlists (CSV files) and automatically researching tracks using the Claude API to generate talking points and cultural context.

## Architecture

### Vite + React Application
- **src/components/RadioShowTool.tsx**: Main React component containing the radio show management logic
- **src/App.tsx**: Root application component
- **src/main.tsx**: Application entry point
- Modern Vite build system with TypeScript support
- Configured for Vercel deployment

### Key Features
- **CSV Upload**: Processes playlist files with artist and track columns
- **AI Research**: Uses Claude API to research each track and generate talking points with source citations
- **Show Management**: Create, view, and manage multiple radio shows
- **Track Management**: Mark tracks as played, filter by genre/decade/region
- **Show Prep Mode**: Clean interface for live radio broadcasts

### State Management
- Uses React's built-in useState hooks for all state management
- No external state management libraries (Redux, Zustand, etc.)
- State includes:
  - `shows`: Array of radio show objects
  - `playedTracks`: Object tracking which tracks have been played
  - `filters`: Current filter settings for tracks
  - `activeView`: Current view mode (dashboard, showPrep, showList)

### API Integration
- Integrates with Claude API (anthropic.com) for track research
- Makes two API calls per track:
  1. Search for reliable sources about the track
  2. Research track details with source citations
- Handles API failures gracefully with fallback data

## Development

### Build System
- **Vite**: Modern build tool with fast HMR and optimized production builds
- **TypeScript**: Full TypeScript support with strict type checking
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **ESLint**: Code linting with React and TypeScript rules

### Commands
- `npm run dev`: Start development server on localhost:3000
- `npm run build`: Build for production (outputs to dist/)
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint checks
- `npm run type-check`: Run TypeScript type checking

### React Patterns Used
- Functional components with hooks
- useCallback for memoized functions
- useMemo for computed values (filtered tracks)
- Conditional rendering for different views

### Styling
- Uses Tailwind CSS classes for styling
- Responsive design with mobile-first approach
- Icon library: Lucide React

### Data Flow
1. User uploads CSV file
2. CSV is parsed to extract track data
3. Each track is researched via Claude API
4. Research results are stored with the track
5. User can filter, search, and manage tracks
6. Tracks can be marked as played during radio show

### Error Handling
- Research failures are captured and tracks are added with minimal data
- Users are notified of failed research attempts
- Graceful degradation when API calls fail

## Deployment

### Vercel Configuration
- **vercel.json**: Configured for automatic deployments
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- Automatic deployments from GitHub when connected

### GitHub Integration
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Automatic deployments on push to main branch
4. Preview deployments for pull requests

## Working with This Codebase

### File Structure
```
src/
├── components/
│   └── RadioShowTool.tsx    # Main application component
├── App.tsx                  # Root component
├── main.tsx                 # Entry point
└── index.css               # Tailwind imports
```

When modifying this code:
- Main logic is in `src/components/RadioShowTool.tsx`
- Maintain existing React patterns and state structure
- Follow existing Tailwind CSS styling approach
- Preserve the three-view system (dashboard, showPrep, showList)
- Test API integration functionality carefully due to external dependencies
- Consider rate limiting when modifying API calls (currently 1 second delay between requests)
- Run `npm run lint` and `npm run type-check` before committing