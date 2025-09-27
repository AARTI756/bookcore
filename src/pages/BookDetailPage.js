// src/pages/BookDetailPage.js - FINAL Corrected Version (with fixed recommendations)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './BookDetailPage.css';
import { getBookById, borrowBook } from '../firebase/firestoreService';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const BookDetailPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendedBooks, setRecommendedBooks] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const data = await getBookById(id);
                setBook(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching book details from Firestore:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBookDetails();
        } else {
            setError('No book ID provided.');
            setLoading(false);
        }
    }, [id]);

    // ✅ Fixed recommendation logic
    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!book || book.isAvailable) {
                setRecommendedBooks([]);
                return;
            }
            try {
                const q = query(
                    collection(db, "books"),
                    where("genre", "==", book.genre),
                    where("isAvailable", "==", true),
                    limit(5)
                );
                const querySnapshot = await getDocs(q);
                const recs = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(recBook => recBook.id !== book.id); // ✅ filter out current book

                setRecommendedBooks(recs);
            } catch (err) {
                console.error("Error fetching recommendations:", err);
                setRecommendedBooks([]);
            }
        };

        if (!loading && book && !book.isAvailable) {
            fetchRecommendations();
        }
    }, [book, loading]);

    const handleBorrowClick = () => {
        if (authLoading) return;

        if (!user) {
            alert('Please log in to borrow this book.');
            navigate('/login', { state: { from: location.pathname } });
        } else {
            if (!book.isAvailable) {
                alert('This book is currently unavailable. Please try again later.');
                return;
            }

            let daysInput = prompt("Do you want to borrow this book? Enter number of days (1-7):", "7");
            let daysToBorrow = parseInt(daysInput);

            if (isNaN(daysToBorrow) || daysToBorrow < 1 || daysToBorrow > 7) {
                alert("Invalid number of days. Please enter a number between 1 and 7.");
                return;
            }

            borrowBook(user.uid, book.id, daysToBorrow)
                .then(() => {
                    alert(`"${book.title}" borrowed successfully for ${daysToBorrow} days! Check your dashboard.`);
                    setBook(prev => ({ ...prev, isAvailable: false }));
                })
                .catch(err => {
                    console.error("Error borrowing book:", err);
                    alert(`Failed to borrow book: ${err.message}`);
                    if (err.message.includes("Book is not available for borrowing.")) {
                        alert("This book is already unavailable or you have borrowed it.");
                    }
                });
        }
    };

    if (loading || authLoading) return <div className="message-text">Loading book details...</div>;
    if (error) return <div className="message-text" style={{ color: 'red' }}>Error: {error}</div>;
    if (!book) return <div className="message-text">Book not found.</div>;

    return (
        <div className="book-detail-container">
            <button onClick={() => navigate(-1)} className="back-button">
                &larr; Back to Library
            </button>
            <div className="book-details-content">
                <div className="cover-image-container">
                    <img src={book.coverImageUrl} alt={book.title} className="cover-image" />
                </div>
                <div className="info-container">
                    <h1 className="book-title">{book.title}</h1>
                    <h2 className="book-author">by {book.author}</h2>
                    <p className="book-genre">Genre: {book.genre}</p>
                    {book.publishedYear && <p className="book-year">Published: {book.publishedYear}</p>}
                    <p className="book-description">{book.description}</p>

                    <p className="book-availability" style={{ color: book.isAvailable ? 'green' : 'red' }}>
                        {book.isAvailable ? 'Available' : 'Currently Rented'}
                    </p>

                    <div className="action-buttons">
                        {book.isAvailable ? (
                            <button className="action-button read-button" onClick={handleBorrowClick}>
                                Borrow (Click to select days)
                            </button>
                        ) : (
                            <button className="action-button unavailable-button" disabled>
                                Currently Rented
                            </button>
                        )}

                        {!book.isAvailable && recommendedBooks.length > 0 && (
                            <div className="recommendations-on-unavailable">
                                <p style={{ color: 'var(--text-dark)', fontWeight: '600', marginBottom: '10px' }}>
                                    This book is currently rented. Try these:
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {recommendedBooks.map(recBook => (
                                        <Link to={`/books/${recBook.id}`} key={recBook.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <span style={{
                                                border: '1px solid var(--border-color)',
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                color: 'var(--text-medium)',
                                                background: 'var(--bg-secondary)',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: '120px',
                                                display: 'block'
                                            }}>
                                                {recBook.title}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailPage;
