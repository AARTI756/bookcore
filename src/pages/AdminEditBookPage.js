import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBookById, updateBook } from '../firebase/firestoreService';

const AdminEditBookPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading, logout } = useAuth();

    const [formData, setFormData] = useState({
        title: '', author: '', genre: '', description: '',
        coverImageUrl: '', pdfUrl: '', isExclusive: false, price: '0', publishedYear: ''
    });
    const [coverFile, setCoverFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);

    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchBookFromFirestore = async () => {
            if (!user || user.role !== 'admin') { setError('Unauthorized access.'); logout(); navigate('/login'); return; }
            try {
                const data = await getBookById(id);
                setFormData({
                    ...data,
                    price: data.price ? data.price.toString() : '0',
                    publishedYear: data.publishedYear ? data.publishedYear.toString() : ''
                });
            } catch (err) {
                setError(err.message);
                console.error("Error fetching book for edit from Firestore:", err);
                if (err.code === 'permission-denied') { alert("Permission denied. Check Firestore Rules."); logout(); navigate('/login'); }
            } finally {
                setPageLoading(false);
            }
        };

        if (id && user && user.role === 'admin' && !authLoading) {
            fetchBookFromFirestore();
        } else if (!user && !authLoading) {
            alert("You need to be logged in to access this page.");
            logout(); navigate('/login');
        }
    }, [id, user, authLoading, logout, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files[0]) {
            if (name === 'coverFile') { setCoverFile(files[0]); }
            else if (name === 'pdfFile') { setPdfFile(files[0]); }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Updating book...');

        if (!user || user.role !== 'admin') { setMessage('Error: You must be an admin to update books.'); logout(); navigate('/login'); return; }

        try {
            await updateBook(
                id,
                { ...formData, price: parseFloat(formData.price), publishedYear: parseInt(formData.publishedYear) },
                coverFile, pdfFile
            );
            setMessage('Book updated successfully!');
            setTimeout(() => navigate('/admin/books'), 1500);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
            console.error("Error updating book in Firestore:", err);
            if (err.code === 'permission-denied') { alert("Permission denied. Check Firestore Rules."); }
        }
    };

    if (pageLoading || authLoading) return <p style={styles.message}>Loading book data for editing...</p>;
    if (error) return <p style={{ ...styles.message, color: 'red' }}>Error: {error}</p>;
    if (!formData.id && !pageLoading) return <p style={styles.message}>Book not found or invalid ID.</p>;

    return (
        <div className="admin-page-card">
            <h1>Edit Book Record</h1>
            <form onSubmit={handleSubmit} style={styles.formStyle}>
                <input style={styles.inputStyle} type="text" name="title" placeholder="Book Title" value={formData.title} onChange={handleChange} required />
                <input style={styles.inputStyle} type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} required />
                <input style={styles.inputStyle} type="text" name="genre" placeholder="Genre (e.g., Fantasy, Sci-Fi)" value={formData.genre} onChange={handleChange} required />
                <textarea style={styles.inputStyle} name="description" placeholder="Book Description" value={formData.description} onChange={handleChange} required rows="4"></textarea>
                
                <div style={styles.fileInputGroup}>
                    <label style={styles.fileLabel}>Current Cover Image:</label>
                    {formData.coverImageUrl && <img src={formData.coverImageUrl} alt="Current Cover" style={styles.currentImage} />}
                    <input id="editCoverFileInput" type="file" name="coverFile" accept="image/*" onChange={handleFileChange} />
                    {coverFile && <span style={styles.fileName}>{coverFile.name}</span>}
                </div>
                <div style={styles.fileInputGroup}>
                    <label style={styles.fileLabel}>Current PDF File:</label>
                    {formData.pdfUrl && <a href={formData.pdfUrl} target="_blank" rel="noopener noreferrer" style={styles.currentPdfLink}>View Current PDF</a>}
                    <input id="editPdfFileInput" type="file" name="pdfFile" accept="application/pdf" onChange={handleFileChange} />
                    {pdfFile && <span style={styles.fileName}>{pdfFile.name}</span>}
                </div>

                <input style={styles.inputStyle} type="number" name="publishedYear" placeholder="Published Year" value={formData.publishedYear} onChange={handleChange} />
                
                <div style={{ margin: '1rem 0', color: 'var(--text-primary)', textAlign: 'left' }}>
                    <label>
                    </label>
                </div>
                
                {formData.isExclusive && (
                    <input style={styles.inputStyle} type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
                )}


                <button type="submit" style={styles.buttonStyle}>Update Book</button>
            </form>
            {message && <p style={{ marginTop: '1rem', textAlign: 'center', color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
        </div>
    );
};

const styles = {
    formStyle: { display: 'flex', flexDirection: 'column', gap: '10px' },
    inputStyle: { padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' },
    fileInputGroup: { marginBottom: '10px', textAlign: 'left', color: 'var(--text-primary)' },
    fileLabel: { display: 'block', marginBottom: '5px', fontWeight: '500' },
    fileName: { marginLeft: '10px', fontStyle: 'italic', color: 'var(--text-secondary)' },
    buttonStyle: { padding: '12px', backgroundColor: 'var(--color-primary)', color: 'black', border: '1px solid var(--border-color)', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' },
    currentImage: { maxWidth: '100px', maxHeight: '150px', objectFit: 'contain', margin: '10px 0', border: '1px solid #e31a1aff', display: 'block' },
    currentPdfLink: { display: 'block', margin: '10px 0', color: 'var(--color-primary)' }
};

export default AdminEditBookPage;