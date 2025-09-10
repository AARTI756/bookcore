import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const { user, loading, firebaseUser } = useAuth(); // Get firebaseUser for initial check
    const location = useLocation();

    if (loading) {
        return <p>Authenticating...</p>;
    }

    // Check if Firebase has authenticated a user AND if our custom user object has the admin role
    if (firebaseUser && user && user.role === 'admin') {
        return children;
    }

    // If not admin or not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminRoute;