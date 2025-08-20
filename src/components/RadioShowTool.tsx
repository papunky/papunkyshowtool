import React, { useState, useCallback, useMemo } from 'react';
import { 
  Upload, 
  Search, 
  Play, 
  Clock, 
  Download, 
  Globe, 
  Music, 
  Calendar, 
  Eye, 
  EyeOff, 
  Plus, 
  ArrowLeft, 
  Radio 
} from 'lucide-react';

// Type definitions
interface Source {
  id: number;
  url: string;
  title: string;
  type: string;
}

interface TalkingPoint {
  text: string;
  sources: number[];
}

interface Track {
  id: string;
  artist: string;
  title: string;
  originalData: Record<string, string>;
  releaseYear: string;
  genre: string;
  subGenre: string;
  region: string;
  culturalContext: string;
  musicalFacts: string;
  globalConnections: string;
  talkingPoints: TalkingPoint[];
  sources: Source[];
  dateAdded: string;
}

interface Show {
  id: string;
  name: string;
  date: string;
  fileName: string;
  tracks: Track[];
}

interface PlayedTrack {
  played: boolean;
  timestamp: string;
}

interface PlayedTracks {
  [key: string]: PlayedTrack;
}

interface Filters {
  genre: string;
  decade: string;
  region: string;
  played: 'all' | 'played' | 'unplayed';
}

interface ShowDetails {
  [key: string]: boolean;
}

interface ResearchResult {
  releaseYear: string;
  genre: string;
  subGenre: string;
  region: string;
  culturalContext: string;
  musicalFacts: string;
  globalConnections: string;
  talkingPoints: TalkingPoint[];
  sources: Source[];
}

const RadioShowTool: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [activeShowId, setActiveShowId] = useState<string | null>(null);
  const [playedTracks, setPlayedTracks] = useState<PlayedTracks>({});
  const [filters, setFilters] = useState<Filters>({
    genre: '',
    decade: '',
    region: '',
    played: 'all'
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeView, setActiveView] = useState<'dashboard' | 'showPrep' | 'showList'>('dashboard');
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [researchProgress, setResearchProgress] = useState<number>(0);
  const [currentlyResearching, setCurrentlyResearching] = useState<string>('');
  const [researchErrors, setResearchErrors] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState<ShowDetails>({});

  // Get current show data
  const currentShow = shows.find(show => show.id === activeShowId);
  const tracks = currentShow ? currentShow.tracks : [];

  // Research a single track using Google Gemini API
  const researchTrack = async (artist: string, title: string): Promise<ResearchResult> => {
    // Check if API key is available
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('No Gemini API key found. Skipping research for:', artist, title);
      return {
        releaseYear: "Unknown",
        genre: "Unknown",
        subGenre: "Unknown", 
        region: "Unknown",
        culturalContext: "API key not configured - add VITE_GEMINI_API_KEY environment variable",
        musicalFacts: "API key not configured - add VITE_GEMINI_API_KEY environment variable",
        globalConnections: "API key not configured - add VITE_GEMINI_API_KEY environment variable",
        talkingPoints: [
          {
            text: `${title} by ${artist}`,
            sources: []
          },
          {
            text: "Configure Gemini API key to enable automatic research",
            sources: []
          },
          {
            text: "Add your own talking points manually",
            sources: []
          }
        ],
        sources: []
      };
    }

    try {
      // Combined research request to Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Research the song "${title}" by ${artist}. Provide comprehensive information for radio show preparation.

Respond with ONLY a valid JSON object in this exact format:

{
  "releaseYear": "YYYY",
  "genre": "primary genre",
  "subGenre": "specific subgenre",
  "region": "country/region of origin",
  "culturalContext": "brief cultural background and historical context",
  "musicalFacts": "interesting musical or production details",
  "globalConnections": "connections to cross-cultural fusion or global music trends",
  "talkingPoints": [
    {
      "text": "concise radio-ready fact 1 (under 25 words)",
      "sources": [1]
    },
    {
      "text": "concise radio-ready fact 2 (under 25 words)", 
      "sources": [1, 2]
    },
    {
      "text": "concise radio-ready fact 3 (under 25 words)",
      "sources": [2]
    }
  ],
  "sources": [
    {
      "id": 1,
      "url": "reliable source URL",
      "title": "source title",
      "type": "music database/encyclopedia/magazine"
    },
    {
      "id": 2, 
      "url": "reliable source URL",
      "title": "source title",
      "type": "music database/encyclopedia/magazine"
    }
  ]
}

Requirements:
- Keep talking points under 25 words each and make them engaging for radio
- Include 2-3 reliable sources (AllMusic, Discogs, Rolling Stone, etc.)
- Focus on interesting facts that radio DJs can use
- Your response must be valid JSON only, no other text`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1000,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        console.error('Gemini API failed:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
        console.error('Invalid Gemini API response format:', data);
        throw new Error('Invalid API response format');
      }

      let responseText = data.candidates[0].content.parts[0].text;
      
      // Clean up any markdown formatting
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      console.log('Gemini response for', artist, title, ':', responseText);
      
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Research failed for:', artist, title, error);
      return {
        releaseYear: "Unknown",
        genre: "Unknown",
        subGenre: "Unknown", 
        region: "Unknown",
        culturalContext: "Research pending",
        musicalFacts: "Research pending",
        globalConnections: "Research pending",
        talkingPoints: [
          {
            text: `${title} by ${artist}`,
            sources: []
          },
          {
            text: "Track details to be researched",
            sources: []
          },
          {
            text: "Additional context coming soon",
            sources: []
          }
        ],
        sources: []
      };
    }
  };

  // Parse CSV and research tracks
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim()); // Remove empty lines
    
    if (lines.length < 2) {
      alert('CSV file must have at least a header row and one data row.');
      return;
    }

    const headers = lines[0].split(',').map((h: string) => h.trim().replace(/"/g, ''));
    console.log('CSV Headers found:', headers);
    
    const csvTracks: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v: string) => v.trim().replace(/"/g, ''));
      if (values.length >= 2 && values[0] && values[1]) {
        const trackObj: Record<string, string> = {};
        headers.forEach((header: string, index: number) => {
          trackObj[header] = values[index] || '';
        });
        csvTracks.push(trackObj);
      }
    }

    console.log(`Parsed ${csvTracks.length} tracks from CSV`);

    if (csvTracks.length === 0) {
      alert(`No valid tracks found in CSV. 
      
Found headers: ${headers.join(', ')}

Please ensure your CSV has columns for artist and title. 
Common column names: artist, title, Artist, Title, Track Artist, Track Name, name`);
      return;
    }

    // Create new show
    const showId = Date.now().toString();
    const showDate = new Date().toLocaleDateString();
    const showName = `Show ${showDate} - ${file.name.replace('.csv', '')}`;

    setIsResearching(true);
    setResearchProgress(0);
    setCurrentlyResearching('');
    setResearchErrors([]);
    
    const researchedTracks: Track[] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < csvTracks.length; i++) {
      const track = csvTracks[i];
      const artist = track.artist || track.Artist || track['Track Artist'] || '';
      const title = track.title || track.Title || track['Track Name'] || track.name || '';
      
      console.log(`Processing track ${i + 1}/${csvTracks.length}:`, { artist, title, trackData: track });
      
      if (artist && title) {
        setCurrentlyResearching(`${artist} - ${title}`);
        
        try {
          const research = await researchTrack(artist, title);
          
          researchedTracks.push({
            id: `${artist}-${title}-${Date.now()}-${i}`,
            artist,
            title,
            originalData: track,
            ...research,
            dateAdded: new Date().toISOString()
          });
        } catch (error) {
          console.error('Failed to research track:', artist, title, error);
          errors.push(`${artist} - ${title}`);
          
          // Add track with minimal data if research fails
          researchedTracks.push({
            id: `${artist}-${title}-${Date.now()}-${i}`,
            artist,
            title,
            originalData: track,
            releaseYear: "Unknown",
            genre: "Unknown",
            subGenre: "Unknown", 
            region: "Unknown",
            culturalContext: "Research failed - please add manually",
            musicalFacts: "Research failed - please add manually",
            globalConnections: "Research failed - please add manually",
            talkingPoints: [
              { text: `${title} by ${artist}`, sources: [] },
              { text: "Manual research needed", sources: [] },
              { text: "Add your own notes", sources: [] }
            ],
            sources: [],
            dateAdded: new Date().toISOString()
          });
        }
        
        setResearchProgress(((i + 1) / csvTracks.length) * 100);
        
        // Small delay to prevent overwhelming the API
        if (i < csvTracks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } else {
        console.warn(`Skipping track ${i + 1} - missing artist or title:`, { artist, title, trackData: track });
      }
    }
    
    setResearchErrors(errors);
    
    const newShow: Show = {
      id: showId,
      name: showName,
      date: new Date().toISOString(),
      fileName: file.name,
      tracks: researchedTracks
    };
    
    setShows(prev => [newShow, ...prev]);
    setActiveShowId(showId);
    setIsResearching(false);
    setResearchProgress(0);
    setCurrentlyResearching('');
    setActiveView('dashboard');
    
    // Show completion message
    const successCount = researchedTracks.length - errors.length;
    const message = errors.length > 0 
      ? `✅ Upload complete! ${successCount} tracks researched successfully, ${errors.length} failed.`
      : `🎉 Upload complete! Successfully researched ${successCount} tracks.`;
    
    alert(message);
  }, []);

  // Filter and search tracks
  const filteredTracks = useMemo(() => {
    return tracks.filter((track: Track) => {
      const matchesSearch = !searchTerm || 
        track.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.genre.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = !filters.genre || track.genre.toLowerCase().includes(filters.genre.toLowerCase());
      
      const trackDecade = Math.floor(parseInt(track.releaseYear) / 10) * 10;
      const matchesDecade = !filters.decade || trackDecade.toString() === filters.decade;
      
      const matchesRegion = !filters.region || track.region.toLowerCase().includes(filters.region.toLowerCase());
      
      const isPlayed = playedTracks[track.id]?.played;
      const matchesPlayed = filters.played === 'all' || 
        (filters.played === 'played' && isPlayed) ||
        (filters.played === 'unplayed' && !isPlayed);
      
      return matchesSearch && matchesGenre && matchesDecade && matchesRegion && matchesPlayed;
    });
  }, [tracks, searchTerm, filters, playedTracks]);

  // Mark track as played
  const markAsPlayed = (trackId: string): void => {
    setPlayedTracks(prev => ({
      ...prev,
      [trackId]: {
        played: true,
        timestamp: new Date().toISOString()
      }
    }));
  };

  // Toggle track details visibility
  const toggleTrackDetails = (trackId: string): void => {
    setShowDetails(prev => ({
      ...prev,
      [trackId]: !prev[trackId]
    }));
  };

  // Export data
  const exportData = (): void => {
    const exportObj = {
      shows,
      playedTracks,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kxlu-radio-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get unique values for filters
  const uniqueGenres = [...new Set(tracks.map((t: Track) => t.genre))].filter(Boolean);
  const uniqueRegions = [...new Set(tracks.map((t: Track) => t.region))].filter(Boolean);
  const uniqueDecades = [...new Set(tracks.map((t: Track) => {
    const year = parseInt(t.releaseYear);
    return isNaN(year) ? null : Math.floor(year / 10) * 10;
  }))].filter((d): d is number => d !== null);

  // Render talking point with citations
  const renderTalkingPoint = (point: TalkingPoint): JSX.Element => {
    if (!point.sources || point.sources.length === 0) {
      return <span>{point.text}</span>;
    }

    return (
      <span>
        {point.text}
        {point.sources.map((sourceId: number) => (
          <sup key={sourceId} className="text-blue-600 ml-0.5">
            [{sourceId}]
          </sup>
        ))}
      </span>
    );
  };

  // Show list view
  if (activeView === 'showList') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Radio className="h-8 w-8 text-red-500" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">papunky | kxlu 88.9 fm</h1>
                  <p className="text-gray-600">Select a show to prep</p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Show
              </button>
            </div>

            <div className="space-y-4">
              {shows.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Radio className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No shows created yet. Upload a playlist to get started!</p>
                </div>
              ) : (
                shows.map((show: Show) => (
                  <div 
                    key={show.id} 
                    className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setActiveShowId(show.id);
                      setActiveView('showPrep');
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{show.name}</h3>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>{show.tracks.length} tracks</span>
                          <span>{new Date(show.date).toLocaleDateString()}</span>
                          <span>{show.fileName}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {show.tracks.filter((track: Track) => playedTracks[track.id]?.played).length} played
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Radio className="h-8 w-8 text-red-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">papunky | kxlu 88.9 fm</h1>
                <p className="text-gray-600">
                  {currentShow ? `Preparing: ${currentShow.name}` : 'Upload a playlist to create a new show'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveView('showList')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <Radio className="h-4 w-4" />
                All Shows
              </button>
              {currentShow && (
                <>
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeView === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveView('showPrep')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeView === 'showPrep' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Show Prep
                  </button>
                </>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isResearching ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-gray-400'
          }`}>
            <Upload className={`mx-auto h-12 w-12 mb-4 ${isResearching ? 'text-gray-300' : 'text-gray-400'}`} />
            <label className={`${isResearching ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
              <span className={`mt-2 block text-sm font-medium ${isResearching ? 'text-gray-400' : 'text-gray-900'}`}>
                {isResearching ? 'Processing Playlist...' : 'Upload New Show Playlist'}
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isResearching}
              />
              <span className={`mt-1 block text-sm ${isResearching ? 'text-gray-400' : 'text-gray-500'}`}>
                {isResearching 
                  ? 'Please wait while tracks are being researched...'
                  : 'CSV file with artist and track columns - Creates a new show'
                }
              </span>
            </label>
          </div>

          {/* Research Progress */}
          {isResearching && (
            <div className="mt-4 bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm text-blue-700 mb-2">
                <span className="font-medium">Researching tracks with source citations...</span>
                <span className="font-mono">{Math.round(researchProgress)}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${researchProgress}%` }}
                />
              </div>
              {currentlyResearching && (
                <div className="text-sm text-blue-600">
                  <span className="font-medium">Currently researching:</span> {currentlyResearching}
                </div>
              )}
              <div className="text-xs text-blue-500 mt-2">
                ⏱️ This process takes about 1-2 seconds per track. Please keep this tab open.
              </div>
            </div>
          )}
          
          {/* Research Errors */}
          {researchErrors.length > 0 && !isResearching && (
            <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">
                ⚠️ Some tracks couldn't be researched automatically:
              </h4>
              <div className="text-xs text-yellow-700 space-y-1">
                {researchErrors.map((track: string, index: number) => (
                  <div key={index}>• {track}</div>
                ))}
              </div>
              <p className="text-xs text-yellow-600 mt-2">
                These tracks were added with basic info. You can edit them manually in the dashboard.
              </p>
            </div>
          )}
        </div>

        {/* Show content only if we have a current show */}
        {currentShow && (
          <>
            {activeView === 'dashboard' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <Music className="h-8 w-8 text-blue-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Tracks</p>
                        <p className="text-2xl font-bold text-gray-900">{tracks.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <Play className="h-8 w-8 text-green-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Played</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {tracks.filter((track: Track) => playedTracks[track.id]?.played).length}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <Globe className="h-8 w-8 text-purple-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Regions</p>
                        <p className="text-2xl font-bold text-gray-900">{uniqueRegions.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <Calendar className="h-8 w-8 text-orange-500" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Decades</p>
                        <p className="text-2xl font-bold text-gray-900">{uniqueDecades.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-64">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search tracks, artists, genres..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <select
                      value={filters.genre}
                      onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Genres</option>
                      {uniqueGenres.map((genre: string) => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                    
                    <select
                      value={filters.decade}
                      onChange={(e) => setFilters(prev => ({ ...prev, decade: e.target.value }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Decades</option>
                      {uniqueDecades.sort((a: number, b: number) => b - a).map((decade: number) => (
                        <option key={decade} value={decade.toString()}>{decade}s</option>
                      ))}
                    </select>
                    
                    <select
                      value={filters.region}
                      onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Regions</option>
                      {uniqueRegions.map((region: string) => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                    
                    <select
                      value={filters.played}
                      onChange={(e) => setFilters(prev => ({ ...prev, played: e.target.value as 'all' | 'played' | 'unplayed' }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Tracks</option>
                      <option value="played">Played</option>
                      <option value="unplayed">Unplayed</option>
                    </select>
                    
                    <button
                      onClick={exportData}
                      disabled={tracks.length === 0}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Track List */}
            <div className="bg-white rounded-lg shadow-sm">
              {activeView === 'showPrep' && (
                <div className="p-4 border-b border-gray-200 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                        🎙️ Show Prep Mode
                      </h2>
                      <p className="text-blue-700 text-sm">{currentShow.name} - Clean view for live broadcasts</p>
                    </div>
                    <button
                      onClick={() => setActiveView('showList')}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      All Shows
                    </button>
                  </div>
                </div>
              )}
              
              <div className="divide-y divide-gray-200">
                {filteredTracks.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    {tracks.length === 0 ? (
                      <>
                        <Music className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <p>No tracks in this show</p>
                      </>
                    ) : (
                      <>
                        <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <p>No tracks match your current filters</p>
                      </>
                    )}
                  </div>
                ) : (
                  filteredTracks.map((track: Track) => {
                    const isPlayed = playedTracks[track.id]?.played;
                    const showDetail = showDetails[track.id];
                    
                    return (
                      <div key={track.id} className={`p-6 ${isPlayed ? 'bg-gray-50' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className={`text-lg font-semibold ${isPlayed ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                                {track.title}
                              </h3>
                              <span className="text-gray-600">by</span>
                              <span className={`font-medium ${isPlayed ? 'text-gray-500' : 'text-gray-800'}`}>
                                {track.artist}
                              </span>
                              {isPlayed && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Played
                                </span>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                              <span className="bg-gray-100 px-2 py-1 rounded">{track.genre}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded">{track.releaseYear}</span>
                              <span className="bg-gray-100 px-2 py-1 rounded">{track.region}</span>
                            </div>
                            
                            {/* Talking Points - Always visible in show prep mode */}
                            {(activeView === 'showPrep' || showDetail) && (
                              <div className="space-y-3">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <h4 className="font-medium text-blue-900 mb-3">🎙️ Radio Talking Points</h4>
                                  <ul className="space-y-2">
                                    {track.talkingPoints.map((point: TalkingPoint, index: number) => (
                                      <li key={index} className="text-blue-800 text-sm">
                                        • {renderTalkingPoint(point)}
                                      </li>
                                    ))}
                                  </ul>
                                  
                                  {/* Sources */}
                                  {track.sources && track.sources.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-blue-200">
                                      <h5 className="text-xs font-medium text-blue-700 mb-2">Sources:</h5>
                                      <div className="space-y-1">
                                        {track.sources.map((source: Source) => (
                                          <div key={source.id} className="text-xs text-blue-600">
                                            [{source.id}] {source.title} - {source.type}
                                            <br />
                                            <a href={source.url} target="_blank" rel="noopener noreferrer" 
                                               className="text-blue-500 hover:underline break-all">
                                              {source.url}
                                            </a>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {activeView === 'dashboard' && (
                                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <h5 className="font-medium text-gray-900 mb-1">Cultural Context</h5>
                                      <p className="text-gray-600">{track.culturalContext}</p>
                                    </div>
                                    <div>
                                      <h5 className="font-medium text-gray-900 mb-1">Musical Facts</h5>
                                      <p className="text-gray-600">{track.musicalFacts}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                      <h5 className="font-medium text-gray-900 mb-1">Global Connections</h5>
                                      <p className="text-gray-600">{track.globalConnections}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-6">
                            {activeView === 'dashboard' && (
                              <button
                                onClick={() => toggleTrackDetails(track.id)}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                title={showDetail ? "Hide details" : "Show details"}
                              >
                                {showDetail ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            )}
                            
                            <button
                              onClick={() => markAsPlayed(track.id)}
                              disabled={!!isPlayed}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                isPlayed
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-green-500 text-white hover:bg-green-600'
                              }`}
                            >
                              {isPlayed ? 'Played' : 'Mark as Played'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RadioShowTool;