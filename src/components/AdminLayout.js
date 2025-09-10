import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // To force Outlet re-render if needed

    if (!user || user.role !== 'admin') {
        navigate('/login', { replace: true });
        return null;
    }

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)', border: '2px solid red' }}> {/* DEBUG BORDER: Red around whole layout */}
            {/* Admin Sidebar Navigation - BASIC STYLES */}
            <div style={{ width: '250px', background: '#e0e0e0', padding: '15px', borderRight: '1px solid #aaa', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <h2 style={{ color: 'blue', marginBottom: '15px' }}>Admin Nav</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
                    <li><NavLink to="/admin" style={{ display: 'block', padding: '8px', background: '#ccc', textDecoration: 'none', color: 'black' }}>Dashboard</NavLink></li>
                    <li><NavLink to="/admin/books" style={{ display: 'block', padding: '8px', background: '#ccc', marginBottom: '5px', textDecoration: 'none', color: 'black' }}>Manage Books</NavLink></li>
                    <li><NavLink to="/admin/users" style={{ display: 'block', padding: '8px', background: '#ccc', textDecoration: 'none', color: 'black' }}>Manage Users</NavLink></li>
                </ul>
            </div>
            {/* Main Content Area where nested routes render */}
            <main style={{ flexGrow: 1, padding: '20px', background: 'white', border: '2px solid green' }}> {/* DEBUG BORDER: Green around content area */}
                {/* CRITICAL: Add key to force re-render on path change */}
                <Outlet key={location.pathname} /> 
            </main>
        </div>
    );
};

export default AdminLayout;