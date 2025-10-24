import React, { useState, useEffect } from 'react';
import './App.css';
import Player from './components/Player';
import SongList from './components/SongList';
import Queue from './components/Queue';
import AuthModal from './components/AuthModal';
import PlaylistsModal, { Playlist } from './components/PlaylistsModal';
import { Song } from './data/Song';
import { Form, Button, InputGroup, Nav, NavDropdown } from 'react-bootstrap';
import { getLoggedInUser, getPlaylists, createPlaylist } from './services/api';

// The new User interface matching our backend model
export interface User {
  _id: string;
  name: string;
  email: string;
}

// Hardcoded for now, should be in a .env file
const YOUTUBE_API_KEY = 'AIzaSyCWUcLEV0uNGa_clCWxOl75hLEmIIV_Gw0';

function App() {
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showPlaylistsModal, setShowPlaylistsModal] = useState(false);

  // Load user on app startup if token exists
  useEffect(() => {
    loadUser();
    loadTrendingMusic();

    const savedQueue = localStorage.getItem('alpha-queue-queue');
    if (savedQueue) {
      setQueue(JSON.parse(savedQueue));
    }
  }, []);

  // Save queue to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('alpha-queue-queue', JSON.stringify(queue));
  }, [queue]);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await getLoggedInUser();
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Could not fetch user', error);
        handleLogout(); // Token might be invalid/expired
      }
    }
  };

  const handleLoginSuccess = (token: string) => {
    // The token is already in localStorage from the AuthModal
    // Now, load the user's data
    loadUser();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setPlaylists([]); // Clear playlists on logout
  };

  const handleSaveQueue = async () => {
    if (!currentUser) return;

    const playlistName = window.prompt('Enter a name for your playlist:');
    if (!playlistName) return;

    try {
      const response = await createPlaylist({ 
        name: playlistName, 
        songs: queue 
      });
      alert(`Playlist '${response.data.name}' saved successfully!`);
    } catch (error) {
      alert('Failed to save playlist.');
    }
  };

  const handleFetchPlaylists = async () => {
    if (!currentUser) return;
    try {
      const response = await getPlaylists();
      setPlaylists(response.data);
      setShowPlaylistsModal(true);
    } catch (error) {
      alert('Failed to fetch playlists.');
    }
  };

  const handleLoadPlaylist = (songs: Song[]) => {
    setQueue(songs);
    setCurrentSongIndex(0);
  };

  const loadTrendingMusic = async () => {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=20&videoCategoryId=10&key=${YOUTUBE_API_KEY}`);
      const data = await response.json();
      if (data.items) {
        const youtubeSongs: Song[] = data.items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          album: 'YouTube Trending',
          duration: 0,
          audioSrc: item.id,
          albumArtSrc: item.snippet.thumbnails.high.url,
        }));
        setSongs(youtubeSongs);
      }
    } catch (error) {
      console.error('Failed to load trending music', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      loadTrendingMusic();
      return;
    }
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&videoCategoryId=10&maxResults=20&key=${YOUTUBE_API_KEY}`);
      const data = await response.json();
      if (data.items) {
        const youtubeSongs: Song[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          album: 'YouTube',
          duration: 0,
          audioSrc: item.id.videoId,
          albumArtSrc: item.snippet.thumbnails.high.url,
        }));
        setSongs(youtubeSongs);
      }
    } catch (error) {
      console.error('Failed to search YouTube', error);
    }
  };

  // --- Queue Management Functions (unchanged) ---
  const handleAddToQueue = (song: Song) => {
    if (!queue.find(s => s.id === song.id)) {
      setQueue(prevQueue => [...prevQueue, song]);
    }
  };

  const handleRemoveFromQueue = (songId: string | number) => {
    setQueue(prevQueue => prevQueue.filter(song => song.id !== songId));
  };

  const handleMoveInQueue = (songId: string | number, direction: 'up' | 'down') => {
    const index = queue.findIndex(s => s.id === songId);
    if (index === -1) return;
    const newQueue = [...queue];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newQueue.length) {
      [newQueue[index], newQueue[targetIndex]] = [newQueue[targetIndex], newQueue[index]];
      setQueue(newQueue);
    }
  };

  const handleClearQueue = () => {
    setQueue([]);
    setCurrentSongIndex(0);
  };

  const handlePlayNext = (song: Song) => {
    let newQueue = [...queue];
    const existingSongIndex = newQueue.findIndex(s => s.id === song.id);
    if (existingSongIndex !== -1) {
      newQueue.splice(existingSongIndex, 1);
    }
    if (newQueue.length === 0) {
      setQueue([song]);
      return;
    }
    const currentId = queue[currentSongIndex]?.id;
    const newCurrentIndex = newQueue.findIndex(s => s.id === currentId);
    const insertIndex = newCurrentIndex + 1;
    newQueue.splice(insertIndex, 0, song);
    setQueue(newQueue);
  };

  const handleNext = () => {
    setCurrentSongIndex(prevIndex => (prevIndex + 1) % queue.length);
  };

  const handlePrev = () => {
    setCurrentSongIndex(prevIndex => (prevIndex - 1 + queue.length) % queue.length);
  };

  const currentSong = queue.length > 0 ? queue[currentSongIndex] : null;

  return (
    <div className="App">
      <header className="App-header bg-dark text-white p-3">
        <div className="d-flex justify-content-between align-items-center">
          <h1>Alpha Queue</h1>
          <div className="d-flex align-items-center w-50">
            <Form onSubmit={handleSearch} className="flex-grow-1 me-3">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search YouTube..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Button variant="primary" type="submit">Search</Button>
              </InputGroup>
            </Form>
            {currentUser ? (
              <NavDropdown title={`Welcome, ${currentUser.name}`} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleFetchPlaylists}>My Playlists</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button variant="outline-light" onClick={() => setShowAuthModal(true)}>Login</Button>
            )}
          </div>
        </div>
      </header>
      <div className="app-body">
        <div className="main-content">
          <SongList 
            songs={songs}
            onAddToQueue={handleAddToQueue} 
            onPlayNext={handlePlayNext} 
          />
        </div>
        <div className="sidebar">
          <Queue 
            queue={queue} 
            currentSong={currentSong} 
            currentUser={currentUser}
            onClearQueue={handleClearQueue}
            onRemoveFromQueue={handleRemoveFromQueue}
            onMoveInQueue={handleMoveInQueue}
            onSaveQueue={handleSaveQueue}
          />
        </div>
      </div>
      <footer className="player-bar bg-light p-2">
        <Player song={currentSong} onNext={handleNext} onPrev={handlePrev} />
      </footer>

      <AuthModal 
        show={showAuthModal} 
        handleClose={() => setShowAuthModal(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      <PlaylistsModal
        show={showPlaylistsModal}
        handleClose={() => setShowPlaylistsModal(false)}
        playlists={playlists}
        onLoadPlaylist={handleLoadPlaylist}
      />
    </div>
  );
}

export default App;