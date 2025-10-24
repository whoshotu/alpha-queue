import React from 'react';
import { Song } from '../data/Song';

// Define the structure of the user object, assuming it's also used here
interface User {
  id: number;
  username: string;
}

interface QueueProps {
  queue: Song[];
  currentSong: Song | null;
  currentUser: User | null; // Add currentUser to props
  onClearQueue: () => void;
  onRemoveFromQueue: (songId: string | number) => void;
  onMoveInQueue: (songId: string | number, direction: 'up' | 'down') => void;
  onSaveQueue: () => void; // Add onSaveQueue to props
}

const Queue: React.FC<QueueProps> = ({ queue, currentSong, currentUser, onClearQueue, onRemoveFromQueue, onMoveInQueue, onSaveQueue }) => {
  return (
    <div className="queue">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Play Queue</h4>
        <div>
          <button 
            className="btn btn-primary btn-sm me-2"
            onClick={onSaveQueue}
            disabled={!currentUser || queue.length === 0}
            title={!currentUser ? 'You must be logged in to save a playlist' : (queue.length === 0 ? 'Add songs to the queue to save' : 'Save current queue as a playlist')}
          >
            Save Playlist
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onClearQueue}>Clear Queue</button>
        </div>
      </div>
      <ul className="list-group">
        {queue.map((song, index) => (
          <li 
            key={song.id} 
            className={`list-group-item d-flex justify-content-between align-items-center ${currentSong?.id === song.id ? 'active' : ''}`}>
            <div className="d-flex align-items-center">
              <img src={song.albumArtSrc} alt={song.title} className="queue-album-art me-3" />
              <div>
                <div>{song.title}</div>
                <div className="text-muted">{song.artist}</div>
              </div>
            </div>
            <div>
              <button className="btn btn-sm btn-light me-2" onClick={() => onMoveInQueue(song.id, 'up')} disabled={index === 0}>&uarr;</button>
              <button className="btn btn-sm btn-light me-2" onClick={() => onMoveInQueue(song.id, 'down')} disabled={index === queue.length - 1}>&darr;</button>
              <button className="btn btn-sm btn-danger" onClick={() => onRemoveFromQueue(song.id)}>&times;</button>
            </div>
          </li>
        ))}
        {queue.length === 0 && <li className="list-group-item text-muted">The queue is empty.</li>}
      </ul>
    </div>
  );
};

export default Queue;