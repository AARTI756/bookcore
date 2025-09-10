import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebaseConfig'; // Import Firestore instance

const AdminDashboardPage = () => {
    const { user } = useAuth();
    const [userCount, setUserCount] = useState(0);
    const [bookCount, setBookCount] = useState(0);
    const [loadingCounts, setLoadingCounts] = useState(true);
    const [error, setError] = useState(null);

    const fetchCounts = useCallback(async () => {
        if (!user || user.role !== 'admin') {
            setLoadingCounts(false);
            return;
        }
        try {
            // Fetch user count
            const usersSnapshot = await getDocs(collection(db, "users"));
            setUserCount(usersSnapshot.size);

            // Fetch book count
            const booksSnapshot = await getDocs(collection(db, "books"));
            setBookCount(booksSnapshot.size);

            // Fetch order count
            

        } catch (err) {
            console.error("Error fetching admin dashboard counts:", err);
            setError(err.message);
        } finally {
            setLoadingCounts(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCounts();
    }, [fetchCounts]);

    if (!user || user.role !== 'admin') {
        return <div className="admin-page-card"><p>Access Denied: You must be an admin.</p></div>;
    }

    if (loadingCounts) {
        return <div className="admin-page-card"><p>Loading admin counts...</p></div>;
    }

    if (error) {
        return <div className="admin-page-card" style={{ color: 'red' }}><p>Error: {error}</p></div>;
    }

    return (
        <div className="admin-page-card">
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user.name}!</p>
            <p>Manage your BookCore library system.</p>
            
            <div style={styles.countsGrid}>
                <div style={styles.countCard}>
                    <h3>Total Users</h3>
                    <p style={styles.countValue}>{userCount}</p>
                </div>
                <div style={styles.countCard}>
                    <h3>Total Books</h3>
                    <p style={styles.countValue}>{bookCount}</p>
                </div>
                
            </div>
        </div>
    );
};

const styles = {
    countsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '30px',
        textAlign: 'center',
    },
    countCard: {
        background: 'var(--bg-primary)',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px var(--shadow-light)',
        border: '1px solid var(--border-color)',
    },
    countValue: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: 'var(--color-primary)',
    }
};

export default AdminDashboardPage;