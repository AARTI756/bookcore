import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBooks, deleteBook } from '../firebase/firestoreService';

const AdminBookListPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, loading: authLoading, logout } = useAuth();
    const navigate = useNavigate();

    const fetchBooksFromFirestore = useCallback(async () => {
        try {
            if (!user || user.role !== 'admin') { throw new Error('Unauthorized access.'); }
            const data = await getBooks();
            setBooks(data);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching books for admin from Firestore:", err);
            if (err.code === 'permission-denied') { alert("Permission denied. Check Firestore Rules."); logout(); navigate('/login'); }
            else { alert("Error fetching books: " + err.message); }
        } finally {
            setLoading(false);
        }
    }, [user, logout, navigate]);

    const handleDelete = async (bookId) => {
        if (window.confirm('Are you sure you want to delete this book permanently?')) {
            try {
                if (!user || user.role !== 'admin') { throw new Error('Unauthorized access.'); }
                await deleteBook(bookId);
                alert('Book deleted successfully!');
                fetchBooksFromFirestore();
            } catch (err) {
                alert(`Error deleting book: ${err.message}`);
                console.error("Error deleting book from Firestore:", err);
                if (err.code === 'permission-denied') { alert("Permission denied. Check Firestore Rules."); }
            }
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin' && !authLoading) {
            fetchBooksFromFirestore();
        } else if (!user && !authLoading) {
            alert("You need to be logged in to access this page.");
            logout();
            navigate('/login');
        }
    }, [user, authLoading, fetchBooksFromFirestore, logout, navigate]);

    if (loading || authLoading) return <p style={styles.message}>Loading book list...</p>;
    if (error) return <p style={{ ...styles.message, color: 'red' }}>Error: {error}</p>;

    return (
        <div className="admin-page-card">
            <h1>Manage Book Records</h1>
            <p>Here you can view, edit, or delete books in the library.</p>
        <Link to="/admin/add-book" style={styles.addButton}>Add New Book</Link> {/* <-- ADD THIS LINE */}

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Title</th>
                        <th style={styles.th}>Author</th>
                        <th style={styles.th}>Genre</th>
                        <th style={styles.th}>Exclusive</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.id}>
                            <td style={styles.td}>{book.title}</td>
                            <td style={styles.td}>{book.author}</td>
                            <td style={styles.td}>{book.genre}</td>
                            <td style={styles.td}>{book.isExclusive ? 'Yes' : 'No'}</td>
                            <td style={styles.td}>
                                <Link to={`/admin/edit-book/${book.id}`} style={styles.editButton}>Edit</Link>
                                <button onClick={() => handleDelete(book.id)} style={styles.deleteButton}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {books.length === 0 && <p style={{textAlign: 'center', marginTop: '2rem'}}>No books found. Add some!</p>}
        </div>
    );
};

const styles = {
    addButton: { display: 'inline-block', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '8px', marginBottom: '2rem', fontWeight: '500' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem', background: 'var(--bg-primary)' },
    th: { borderBottom: '2px solid var(--border-color)', padding: '12px', textAlign: 'left', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600' },
    td: { borderBottom: '1px solid var(--border-color)', padding: '12px', verticalAlign: 'middle', color: 'var(--text-primary)', wordBreak: 'break-all' },
    editButton: { padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', textDecoration: 'none', marginRight: '10px', fontSize: '0.9rem' },
    deleteButton: { padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem' },
    message: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: 'var(--text-primary)' },
};

export default AdminBookListPage;