import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { Song } from '../data/Song';

// Define the structure of a Playlist
export interface Playlist {
    id: number;
    name: string;
    songs: Song[];
}

interface PlaylistsModalProps {
    show: boolean;
    handleClose: () => void;
    playlists: Playlist[];
    onLoadPlaylist: (songs: Song[]) => void;
}

const PlaylistsModal: React.FC<PlaylistsModalProps> = ({ show, handleClose, playlists, onLoadPlaylist }) => {

    const handleLoad = (songs: Song[]) => {
        onLoadPlaylist(songs);
        handleClose();
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>My Playlists</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    {playlists.length > 0 ? (
                        playlists.map(playlist => (
                            <ListGroup.Item key={playlist.id} className="d-flex justify-content-between align-items-center">
                                {playlist.name}
                                <Button variant="primary" size="sm" onClick={() => handleLoad(playlist.songs)}>
                                    Load
                                </Button>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <ListGroup.Item className="text-muted">You have no saved playlists.</ListGroup.Item>
                    )}
                </ListGroup>
            </Modal.Body>
        </Modal>
    );
};

export default PlaylistsModal;
