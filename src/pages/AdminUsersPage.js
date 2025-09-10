import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, deleteUserFromFirestore } from '../firebase/firestoreService';
// No direct firebase/auth imports here, AuthContext handles Firebase Auth user operations

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, loading: authLoading, logout, firebaseUser } = useAuth();
    const navigate = useNavigate();

    const fetchUsersFromFirestore = useCallback(async () => {
        try {
            if (!user || user.role !== 'admin') { throw new Error('Unauthorized access.'); }
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching users for admin from Firestore:", err);
            if (err.code === 'permission-denied') { alert("Permission denied to access users. Check Firestore Rules."); logout(); navigate('/login'); }
            else { alert("Error fetching users: " + err.message); }
        } finally {
            setLoading(false);
        }
    }, [user, logout, navigate]);

    const handleDelete = async (uidToDelete) => {
        if (window.confirm('Are you sure you want to delete this user permanently? This action cannot be undone.')) {
            try {
                if (!user || user.role !== 'admin') { throw new Error('Unauthorized access.'); }
                if (firebaseUser && firebaseUser.uid === uidToDelete) {
                    alert('You cannot delete your own account from here.');
                    return;
                }
                
                await deleteUserFromFirestore(uidToDelete);
                alert('User deleted successfully!');
                fetchUsersFromFirestore();
            } catch (err) {
                alert(`Error deleting user: ${err.message}`);
                console.error("Error deleting user from Firestore:", err);
                if (err.code === 'permission-denied') { alert("Permission denied to delete users. Check Firestore Rules."); }
            }
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin' && !authLoading) {
            fetchUsersFromFirestore();
        } else if (!user && !authLoading) {
            alert("You need to be logged in to access this page.");
            logout();
            navigate('/login');
        }
    }, [user, authLoading, fetchUsersFromFirestore, logout, navigate]);

    if (loading || authLoading) return <p style={styles.message}>Loading user list...</p>;
    if (error) return <p style={{ ...styles.message, color: 'red' }}>Error: {error}</p>;

    return (
        <div className="admin-page-card">
            <h1>Manage User Accounts</h1>
            <p>Here you can view and manage registered users.</p>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Role</th>
                        <th style={styles.th}>User ID</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td style={styles.td}>{u.firstName} {u.lastName}</td>
                            <td style={styles.td}>{u.email}</td>
                            <td style={styles.td}>{u.role}</td>
                            <td style={styles.td}>{u.id}</td>
                            <td style={styles.td}>
                                {user && u.id === firebaseUser?.uid ? (
                                    <button style={{...styles.deleteButton, ...styles.disabledButton}} disabled>Your Account</button>
                                ) : (
                                    <button onClick={() => handleDelete(u.id)} style={styles.deleteButton}>Delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {users.length === 0 && <p style={{textAlign: 'center', marginTop: '2rem'}}>No users found.</p>}
        </div>
    );
};

const styles = {
    addButton: { display: 'inline-block', padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'white', textDecoration: 'none', borderRadius: '8px', marginBottom: '2rem', fontWeight: '500' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: 'var(--bg-primary)' },
    th: { borderBottom: '2px solid var(--border-color)', padding: '12px', textAlign: 'left', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' },
    td: { borderBottom: '1px solid var(--border-color)', padding: '12px', verticalAlign: 'middle', color: 'var(--text-primary)', wordBreak: 'break-all' },
    deleteButton: { padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem' },
    disabledButton: { opacity: 0.6, cursor: 'not-allowed' },
    message: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: 'var(--text-primary)' },
};

export default AdminUsersPage;