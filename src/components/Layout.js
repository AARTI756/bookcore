import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="page-content">
                <Outlet />
            </main>
            {/* You could add a Footer component here as well */}
        </div>
    );
};

export default Layout;