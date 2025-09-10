import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addBook } from '../firebase/firestoreService';

const AdminAddBookPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [formData, setFormData] = useState({
        title: '', author: '', genre: '', description: '',
        isExclusive: false, price: '0', publishedYear: '',
    });
    const [coverFile, setCoverFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);

    const [message, setMessage] = useState('');

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
        setMessage('Adding book...');

        if (!user || user.role !== 'admin') {
            setMessage('Error: You must be an admin to add books.');
            logout(); navigate('/login'); return;
        }
        if (!coverFile) { setMessage('Please select a cover image.'); return; }
        if (!pdfFile) { setMessage('Please select a PDF file.'); return; }

        try {
            const addedBook = await addBook(
                { ...formData, price: parseFloat(formData.price), publishedYear: parseInt(formData.publishedYear) },
                coverFile, pdfFile
            );
            setMessage(`Book "${addedBook.title}" added successfully!`);
            setFormData({ title: '', author: '', genre: '', description: '', isExclusive: false, price: '0', publishedYear: '' });
            setCoverFile(null); setPdfFile(null);
            document.getElementById('coverFileInput').value = '';
            document.getElementById('pdfFileInput').value = '';

        } catch (error) {
            setMessage('Error adding book: ' + error.message);
            console.error('Error adding book to Firestore:', error);
            if (error.code === 'permission-denied') { alert("Permission denied. Check Firestore Rules."); }
        }
    };

    return (
        <div className="admin-page-card">
            <h1>Add a New Book</h1>
            <form onSubmit={handleSubmit} style={styles.formStyle}>
                <input style={styles.inputStyle} type="text" name="title" placeholder="Book Title" value={formData.title} onChange={handleChange} required />
                <input style={styles.inputStyle} type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} required />
                <input style={styles.inputStyle} type="text" name="genre" placeholder="Genre (e.g., Fantasy, Sci-Fi)" value={formData.genre} onChange={handleChange} required />
                <textarea style={styles.inputStyle} name="description" placeholder="Book Description" value={formData.description} onChange={handleChange} required rows="4"></textarea>
                
                <div style={styles.fileInputGroup}>
                    <label style={styles.fileLabel}>Cover Image:</label>
                    <input id="coverFileInput" type="file" name="coverFile" accept="image/*" onChange={handleFileChange} required />
                    {coverFile && <span style={styles.fileName}>{coverFile.name}</span>}
                </div>
                <div style={styles.fileInputGroup}>
                    <label style={styles.fileLabel}>Book PDF:</label>
                    <input id="pdfFileInput" type="file" name="pdfFile" accept="application/pdf" onChange={handleFileChange} required />
                    {pdfFile && <span style={styles.fileName}>{pdfFile.name}</span>}
                </div>

                <input style={styles.inputStyle} type="number" name="publishedYear" placeholder="Published Year" value={formData.publishedYear} onChange={handleChange} />
                
                <div style={{ margin: '1rem 0', color: 'var(--text-primary)', textAlign: 'left' }}>
                    <label>
                        <input type="checkbox" name="isExclusive" checked={formData.isExclusive} onChange={handleChange} style={{ marginRight: '8px' }} />
                        Is this an exclusive (paid) book?
                    </label>
                </div>
                
                {formData.isExclusive && (
                    <input style={styles.inputStyle} type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
                )}

                <button type="submit" style={styles.buttonStyle}>Add Book</button>
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
    buttonStyle: { padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' },
};

export default AdminAddBookPage;