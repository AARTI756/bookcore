
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Required for GoogleLogin button
import { AuthProvider, useAuth } from './context/AuthContext';

// --- Import Layouts and Route Protectors ---
import Layout from './components/Layout'; // Main app layout (includes Navbar)
import AdminLayout from './components/AdminLayout'; // Admin specific layout (sidebar + outlet)
import AdminRoute from './components/AdminRoute'; // Protects admin routes
import ProtectedRoute from './components/ProtectedRoute'; // Protects user routes

// --- Import Pages ---
import UserBorrowPage from './pages/UserBorrowPage';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminAddBookPage from './pages/AdminAddBookPage';
import AdminBookListPage from './pages/AdminBookListPage';
import AdminEditBookPage from './pages/AdminEditBookPage';
import AdminUsersPage from './pages/AdminUsersPage';
import BookDetailPage from './pages/BookDetailPage';

// --- Import Global CSS ---
import './App.css';
import './components/Navbar.css';
import './components/AdminLayout.css'; // Ensure this CSS is correctly imported for the admin sidebar

// Google Client ID (from your Google Cloud Console)
const googleClientId = "906978735051-9uo1jek6ofucneoe63348844v0kgoq2v.apps.googleusercontent.com"; // Your Client ID

const AppRoutes = () => {
    const { user, loading, firebaseUser } = useAuth(); // Get user context
    const navigate = useNavigate();
    const location = useLocation(); // To capture the intended path after login

    // Effect to handle automatic redirection after authentication state changes
    useEffect(() => {
  if (!loading && firebaseUser) {
    const from = location.state?.from || null;
    const currentPath = location.pathname;

    if (user?.role === 'admin') {
      // Admin handling
      if (currentPath !== '/admin' && !currentPath.startsWith('/admin/')) {
        navigate('/admin', { replace: true });
      }
    } else {
      // Regular user handling
      const allowedUserRoutes = [
        '/dashboard',
        '/borrow-books',
        '/my-books',
        '/profile',
        '/browse'
      ];

      // allow book detail pages like /books/:id
      if (currentPath.startsWith('/books/')) {
        return;
      }

      if (from && currentPath !== from) {
        // Redirect user back to the page they wanted before login
        navigate(from, { replace: true, state: {} });
      } else if (!allowedUserRoutes.includes(currentPath)) {
        navigate('/dashboard');
      }
    }
  } else if (!firebaseUser && !loading) {
    // If logged out: let ProtectedRoute handle redirect
  }
}, [firebaseUser, user, loading, navigate, location.state, location.pathname]);


    return (
        <Routes>
            {/* Main Layout Route: Wraps all public and private routes */}
            <Route path="/" element={<Layout />}>
                
                {/* Publicly Accessible Pages */}
                <Route index element={<HomePage />} /> {/* Landing page */}
                <Route path="browse" element={<BrowsePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="books/:id" element={<BookDetailPage />} />
                
                {/* --- User-Only Protected Pages --- */}
                <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="borrow-books" element={<ProtectedRoute><UserBorrowPage /></ProtectedRoute>} /> {/* Borrow Books Page */}
                <Route path="my-books" element={<ProtectedRoute><h1>My Books Page (Coming Soon)</h1></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><h1>User Profile Page (Coming Soon)</h1></ProtectedRoute>} />
                
                
                {/* --- Admin-Only Protected Pages (nested under /admin) --- */}
                {/* Parent route for all admin pages. AdminLayout handles the sidebar and renders child routes */}
                <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    {/* Nested routes render within AdminLayout's <Outlet /> */}
                    <Route index element={<AdminDashboardPage />} /> {/* Default for /admin */}
                    <Route path="dashboard" element={<Navigate to="/admin" replace />} /> {/* Redirect /admin/dashboard to /admin */}

                    <Route path="books" element={<AdminBookListPage />} />
                    <Route path="add-book" element={<AdminAddBookPage />} />
                    <Route path="edit-book/:id" element={<AdminEditBookPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="analytics" element={<h1>Admin Analytics Page (Coming Soon)</h1>} />
                    <Route path="settings" element={<h1>Admin Settings Page (Coming Soon)</h1>} />
                </Route>
                
                {/* Catch-all 404 Page */}
                <Route path="*" element={<h1>404: Page Not Found</h1>} />
            </Route>
        </Routes>
    );
};

function App() {
    return (
        <GoogleOAuthProvider clientId={googleClientId}> 
            <AuthProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}

export default App;