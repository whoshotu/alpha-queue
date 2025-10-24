import React, { useState } from 'react';
import { Modal, Button, Form, Nav, Alert } from 'react-bootstrap';
import { login, register } from '../services/api';

interface AuthModalProps {
    show: boolean;
    handleClose: () => void;
    onLoginSuccess: (token: string) => void; // Callback now passes the token
}

const AuthModal: React.FC<AuthModalProps> = ({ show, handleClose, onLoginSuccess }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            let response;
            if (isRegister) {
                response = await register({ name, email, password });
            } else {
                response = await login({ email, password });
            }

            if (response.data && response.data.token) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                onLoginSuccess(token);
                handleClose();
            } else {
                setError('An unexpected error occurred.');
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'An error occurred.';
            setError(errorMsg);
        }
    };

    const handleToggleMode = () => {
        setIsRegister(!isRegister);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isRegister ? 'Create Account' : 'Login'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    {isRegister && (
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter your name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Enter email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        {isRegister ? 'Register' : 'Login'}
                    </Button>
                </Form>
                <Nav className="mt-3 justify-content-center">
                    <Nav.Item>
                        <Nav.Link onClick={handleToggleMode}>
                            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Modal.Body>
        </Modal>
    );
};

export default AuthModal;