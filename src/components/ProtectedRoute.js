import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

// In src/components/ProtectedRoute.js

const ProtectedRoute = ({ children }) => {
    const { loading, firebaseUser } = useAuth();
    const location = useLocation();

    console.log("ProtectedRoute Debug:", location.pathname, "Loading:", loading, "FirebaseUser:", firebaseUser ? true : false); // ADD THIS LOG

    if (loading) {
        console.log("ProtectedRoute Debug: Still loading auth."); // ADD THIS LOG
        return <p style={{ textAlign: 'center', padding: '5rem', fontSize: '1.5rem' }}>Loading user session...</p>;
    }

    if (firebaseUser) {
        console.log("ProtectedRoute Debug: User authenticated. Granting access to:", location.pathname); // ADD THIS LOG
        return children;
    }

    console.log("ProtectedRoute Debug: User NOT authenticated. Redirecting to login from:", location.pathname); // ADD THIS LOG
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;