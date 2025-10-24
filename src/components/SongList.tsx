import React from 'react';
import { Song } from '../data/Song';
import { Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPlay } from '@fortawesome/free-solid-svg-icons';

interface SongListProps {
  songs: Song[];
  onAddToQueue: (song: Song) => void;
  onPlayNext: (song: Song) => void;
}

const SongList: React.FC<SongListProps> = ({ songs, onAddToQueue, onPlayNext }) => {
  return (
    <div className="song-library">
      <h2 className="mb-4">Library</h2>
      <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
        {songs.map(song => (
          <Col key={song.id}>
            <Card className="h-100 song-card">
              <div className="card-img-container">
                <Card.Img variant="top" src={song.albumArtSrc} />
                <div className="card-actions">
                  <button className="btn btn-primary btn-circle" onClick={() => onPlayNext(song)}>
                    <FontAwesomeIcon icon={faPlay} />
                  </button>
                  <button className="btn btn-secondary btn-circle" onClick={() => onAddToQueue(song)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
              <Card.Body>
                <Card.Title className="text-truncate">{song.title}</Card.Title>
                <Card.Text className="text-muted">{song.artist}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SongList;
