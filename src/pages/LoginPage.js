// src/pages/LoginPage.js - THE FINAL, VERIFIED LOGIN PAGE CODE

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google'; // Using @react-oauth/google
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // To access login/logout from context
import RegistrationForm from '../components/RegistrationForm'; // The reusable sign-up form
import './LoginPage.css'; // The dedicated CSS for this page

// --- SignInForm Component (Nested) ---
const SignInForm = ({ onSignUpClick }) => {
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await login(email, password); // Call Firebase email/password login
            // Redirection is handled by AuthContext's onAuthStateChanged -> App.js useEffect
        } catch (error) {
            let errorMessage = 'Login failed.';
            if (error.code) { // Firebase errors have a 'code'
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        errorMessage = 'Invalid email or password.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email format.';
                        break;
                    default:
                        errorMessage = `Login error: ${error.message}`;
                }
            }
            setMessage(errorMessage);
            console.error("Firebase Login error:", error);
        }
    };

    // --- Google Login Success Handler (for @react-oauth/google) ---
    const handleGoogleLoginClick = async (response) => {
        setMessage('');
        try {
            await loginWithGoogle(); // Call Firebase Google login via AuthContext
            navigate('/dashboard'); // Direct navigation after Google login
            alert("Logged in with Google! (Note: Google login is not persistent across refreshes in this demo).");
        } catch (error) {
            let errorMessage = 'Google login failed.';
            if (error.code) {
                switch (error.code) {
                    case 'auth/popup-closed-by-user':
                        errorMessage = 'Google login popup closed.';
                        break;
                    case 'auth/cancelled-popup-request':
                        errorMessage = 'Google login request cancelled.';
                        break;
                    default:
                        errorMessage = `Google login error: ${error.message}`;
                }
            }
            setMessage(errorMessage);
            console.error("Firebase Google Login error:", error);
        }
    };
    
    // --- Google Login Error Handler (for @react-oauth/google) ---
    const onGoogleButtonError = (error) => {
        console.error("GoogleLogin Button Error:", error);
        setMessage('Google button error: Check console and Google Cloud Console settings.');
    };


    return (
        <div>
            <h1>Sign In to BookCore</h1>
            <form onSubmit={handleSignIn}>
                {message && <p style={{ color: message.includes('successful') ? 'green' : 'red', marginBottom: '1rem' }}>{message}</p>}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Sign In</button>
            </form>
            <div className="separator">or</div>
            <div className="google-login-container">
                <GoogleLogin
                    clientId="906978735051-9uo1jek6ofucneoe63348844v0kgoq2v.apps.googleusercontent.com" // Your Client ID
                    onSuccess={handleGoogleLoginClick}
                    onError={onGoogleButtonError}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
            <Link to="/forgot-password" className="forgot-password-link">Forgot your password?</Link>
            <div className="toggle-link">
                Don't have an account?
                <button type="button" onClick={onSignUpClick}>Sign Up</button>
            </div>
        </div>
    );
};

// --- SignUpForm Component (Nested) ---
const SignUpForm = ({ onSignInClick }) => {
    // This component now *renders* the RegistrationForm
    return (
        <div>
            <h1>Create Your Account</h1>
            <RegistrationForm />
            <div className="toggle-link">
                Already have an account?
                <button type="button" onClick={onSignInClick}>Sign In</button>
            </div>
        </div>
    );
};

// --- Main LoginPage Component ---
const LoginPage = () => {
    const [isSigningUp, setIsSigningUp] = useState(false);
    return (
        <div className="login-page-container">
            <div className="auth-form-wrapper">
                {isSigningUp ? (
                    <SignUpForm onSignInClick={() => setIsSigningUp(false)} />
                ) : (
                    <SignInForm onSignUpClick={() => setIsSigningUp(true)} />
                )}
            </div>
        </div>
    );
};

export default LoginPage;