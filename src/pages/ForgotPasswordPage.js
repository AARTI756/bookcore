// src/pages/ForgotPasswordPage.js - Firebase Authentication Integration

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../pages/LoginPage.css';

const ForgotPasswordPage = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!email) {
            setMessage('Please enter your email address.');
            return;
        }
        try {
            await resetPassword(email);
            setMessage('Password reset email sent! Check your inbox.');
            setEmail('');
        } catch (error) {
            let errorMessage = 'Failed to send reset email.';
            if (error.code) {
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'No user found with that email.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email format.';
                        break;
                    default:
                        errorMessage = `Error: ${error.message}`;
                }
            }
            setMessage(errorMessage);
            console.error("Firebase Password Reset error:", error);
        }
    };

    return (
        <div className="login-page-container">
            <div className="auth-form-wrapper">
                <h1>Forgot Your Password?</h1>
                <p style={{ color: 'var(--text-medium)', marginBottom: '1.5rem' }}>Enter your email to receive a password reset link.</p>
                <form onSubmit={handleSubmit}>
                    {message && <p style={{ color: message.includes('sent') ? 'green' : 'red', marginBottom: '1rem' }}>{message}</p>}
                    <input
                        type="email"
                        placeholder="Your Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Send Reset Link</button>
                </form>
                <Link to="/login" className="forgot-password-link" style={{ marginTop: '2rem' }}>Back to Login</Link>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;