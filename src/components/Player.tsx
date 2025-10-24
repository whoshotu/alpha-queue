import React, { useState, useRef, useEffect } from 'react';
import { Song } from '../data/Song';
import YouTube from 'react-youtube';
import { YouTubePlayer } from 'react-youtube';
import { ProgressBar } from 'react-bootstrap';

interface PlayerProps {
  song: Song | null;
  onNext: () => void;
  onPrev: () => void;
}

const Player: React.FC<PlayerProps> = ({ song, onNext, onPrev }) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getPlayerState() === 1) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        setProgress((currentTime / duration) * 100);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePlayPause = () => {
    if (playerRef.current) {
      const playerState = playerRef.current.getPlayerState();
      if (playerState === 1) { // Playing
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
  };

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    event.target.setPlaybackQuality('hd1080');
    playerRef.current.setVolume(volume);
    playerRef.current.playVideo();
    setIsPlaying(true);
  };
  
  const onPlayerStateChange = (event: { data: number }) => {
    if (event.data === 1) { // Playing
        setIsPlaying(true);
    } else {
        setIsPlaying(false);
    }
  };

  if (!song) {
    return (
      <div className="player text-center">
        <div className="text-muted">Select a song to begin playback.</div>
      </div>
    );
  }

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="player">
      <div className="d-flex align-items-center">
        <div className="song-info flex-grow-1">
          <h5 className="mb-0">{song.title}</h5>
          <p className="mb-0 text-muted">{song.artist}</p>
        </div>
        <div className="controls mx-4 d-flex align-items-center">
          <button className="btn btn-link text-white mx-1" onClick={onPrev}>
            <i className="fas fa-backward"></i>
          </button>
          <button className="btn btn-primary mx-2" onClick={handlePlayPause}>
            {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
          </button>
          <button className="btn btn-link text-white mx-1" onClick={onNext}>
            <i className="fas fa-forward"></i>
          </button>
        </div>
        <div className="progress-bar-container flex-grow-1 mx-3">
          <ProgressBar now={progress} />
        </div>
        <div className="volume-control d-flex align-items-center">
          <i className="fas fa-volume-up me-2"></i>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume} 
            onChange={handleVolumeChange} 
            className="form-range"
          />
        </div>
      </div>
      <div style={{ display: 'none' }}>
        <YouTube
          videoId={song.audioSrc}
          opts={opts}
          onReady={onPlayerReady}
          onEnd={onNext}
          onStateChange={onPlayerStateChange}
        />
      </div>
    </div>
  );
};

export default Player;