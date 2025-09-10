// src/pages/ResetPasswordPage.js - Firebase Authentication Integration

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth'; // Import Firebase function
import { auth } from '../firebaseConfig'; // Import auth instance
import '../pages/LoginPage.css'; // Reusing styling from LoginPage

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams(); // Gets the oobCode (token) from the URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        if (!password || password.length < 6) {
            setMessage('Password must be at least 6 characters.');
            return;
        }
        try {
            // Firebase function to confirm password reset
            await confirmPasswordReset(auth, token, password);
            setMessage('Your password has been reset successfully! Redirecting to login...');
            setPassword(''); // Clear password field
            setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
        } catch (error) {
            let errorMessage = 'Failed to reset password.';
            if (error.code) { // Firebase errors have a 'code'
                switch (error.code) {
                    case 'auth/expired-action-code':
                        errorMessage = 'The reset link has expired.';
                        break;
                    case 'auth/invalid-action-code':
                        errorMessage = 'The reset link is invalid.';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = 'User account is disabled.';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'User not found.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password is too weak.';
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
                <h1>Reset Your Password</h1>
                <p style={{ color: 'var(--text-medium)', marginBottom: '1.5rem' }}>Enter your new password.</p>
                <form onSubmit={handleSubmit}>
                    {message && <p style={{ color: message.includes('successful') ? 'green' : 'red', marginBottom: '1rem' }}>{message}</p>}
                    <input
                        type="password"
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;