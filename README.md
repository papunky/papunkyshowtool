# papunky | KXLU 88.9 FM Radio Tool

A modern React application for radio show management at KXLU 88.9 FM. Upload playlists, research tracks with AI, and prepare for live broadcasts.

## Features

- 📁 **CSV Playlist Upload**: Import show playlists with artist and track information
- 🤖 **AI-Powered Research**: Automatic track research using Claude API with source citations
- 🎙️ **Show Prep Mode**: Clean interface optimized for live radio broadcasts
- 📊 **Track Management**: Filter by genre, decade, region, and played status
- 🗂️ **Multi-Show Support**: Manage multiple radio shows and their playlists
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Claude API key from [Anthropic Console](https://console.anthropic.com/)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd papunky

# Install dependencies
npm install

# Configure API key
cp .env.example .env
# Edit .env and add your Claude API key:
# VITE_CLAUDE_API_KEY=sk-ant-api03-your-key-here

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### CSV Format
Your Spotify playlist CSV should have columns for artist and track title. Supported column names:
- `artist`, `Artist`, `Track Artist` - for artist names
- `title`, `Title`, `Track Name`, `name` - for song titles

Example CSV format:
```csv
artist,title,album,duration
The Beatles,Hey Jude,The Beatles 1967-1970,7:11
Bob Dylan,Like a Rolling Stone,Highway 61 Revisited,6:13
```

See `sample-playlist.csv` for a complete example.

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Automatic deployments will trigger on every push to main

### Manual Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## Usage

1. **Upload a Playlist**: Click the upload area and select a CSV file with artist and track columns
2. **AI Research**: The app will automatically research each track and generate talking points
3. **Manage Shows**: Switch between dashboard and show prep modes
4. **Live Broadcasting**: Use Show Prep mode for a clean interface during broadcasts
5. **Track Playback**: Mark tracks as played during your show

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Claude API for track research
- **Deployment**: Vercel

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Run linting: `npm run lint`
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

Built with ❤️ for KXLU 88.9 FM