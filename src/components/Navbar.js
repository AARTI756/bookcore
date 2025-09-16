import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-logo">
                BookCore 📚
            </NavLink>

            <div className="navbar-search-placeholder">
                {/* Future: We will add the real search bar here */}
            </div>

            <div className="navbar-links">
                {/* These links are always visible for all users/guests */}
                <NavLink to="/">Home</NavLink>
                {!user || (user && user.role !== 'admin') ? (
                   <NavLink to="/borrow-books">Borrow Books</NavLink>
                ) : null}
                {user ? (
                    <>
                        {user.role === 'admin' ? ( // Admin specific links
                            <>
                            </>
                        ) : ( // Regular user links
                            <>
            </>
                        )}
                        <button onClick={logout} className="logout-button">Logout</button>
                    </>
                ) : (
                    <NavLink to="/login" className="login-button">Login / Sign Up</NavLink>
                )}
                <label className="theme-switch">
                    <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                    <span className="slider"></span>
                </label>
            </div>
        </nav>
    );
};

export default Navbar;