// src/pages/UserBorrowPage.js - FINAL Version with all scope issues fixed

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { getBooks, searchBooks, borrowBook } from '../firebase/firestoreService'; // Import necessary Firestore service functions
import { collection, doc, getDoc, query, where, limit, getDocs } from 'firebase/firestore'; // Import query functions
import { db } from '../firebaseConfig'; // Import db instance

// Import CSS files
import './HomePage.css';
import './HomePageSearch.css';
import './DashboardPage.css'; // For general card styling

const UserBorrowPage = () => {
    // --- State Hooks ---
    const [allBooks, setAllBooks] = useState([]);
    const [displayedBooks, setDisplayedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    // Genre filter state
    const [activeGenre, setActiveGenre] = useState('All Genres');
    const [dynamicGenres, setDynamicGenres] = useState(['All Genres']);

    // --- Auth Context and Navigation ---
    // CRITICAL FIX: Destructure user as appUser to match the code's usage
    const { user: appUser, loading: authLoading, logout, firebaseUser } = useAuth();
    const navigate = useNavigate();

    // --- Function to Fetch Books and Genres ---
    const fetchBooksAndGenres = useCallback(async () => {
        console.log("UserBorrowPage: fetchBooksAndGenres called.");
        try {
            // Ensure user is authenticated before fetching books
            if (!firebaseUser) { // Check firebaseUser directly
                console.log("UserBorrowPage: No firebaseUser, not fetching books.");
                setLoading(false);
                alert("You need to be logged in to access this page.");
                navigate('/login');
                return;
            }
            console.log("UserBorrowPage: Fetching books for user:", firebaseUser.uid);
            const data = await getBooks();
            console.log("UserBorrowPage: Fetched books:", data);
            setAllBooks(data);
            setDisplayedBooks(data.filter(book => book.isAvailable));
            
            const uniqueGenres = ['All Genres', ...new Set(data.map(book => book.genre).filter(Boolean))];
            setDynamicGenres(uniqueGenres.sort());
        } catch (err) {
            console.error("Error fetching books for UserBorrowPage from Firestore:", err);
            setError(err.message);
            if (err.code === 'permission-denied') {
                alert("Permission denied to access books. Check Firestore Rules.");
                logout();
                navigate('/login');
            } else {
                alert("Error fetching books: " + err.message);
            }
        } finally {
            setLoading(false);
            console.log("UserBorrowPage: Loading state set to false.");
        }
    }, [logout, navigate, firebaseUser]); // Dependencies for useCallback

    // --- Effect to Trigger Data Fetching and Redirection ---
  useEffect(() => {
    if (authLoading) return; // Wait until auth is resolved

    if (!firebaseUser) {
        alert("You need to be logged in to access this page.");
        navigate('/login');
        return;
    }

    // Only fetch if user exists
    fetchBooksAndGenres();
}, [firebaseUser, authLoading, fetchBooksAndGenres, navigate]);

    // Effect for genre filtering
    useEffect(() => {
        let filtered = allBooks;
        filtered = filtered.filter(book => book.isAvailable); // Filter for available books

        if (activeGenre !== 'All Genres') {
            filtered = filtered.filter(book => 
                book.genre && book.genre.toLowerCase() === activeGenre.toLowerCase()
            );
        }
        setDisplayedBooks(filtered);
    }, [activeGenre, allBooks]);

    // Live Search Effect (debounced)
    const handleSearch = useCallback(async () => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }
        setSearchLoading(true);
        try {
            const results = await searchBooks(searchTerm.toLowerCase());
            setSearchResults(results.filter(book => book.isAvailable));
        } catch (error) {
            console.error("Error during live search on UserBorrowPage:", error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, [searchTerm]);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => { handleSearch(); }, 500);
        return () => { clearTimeout(handler); };
    }, [searchTerm, handleSearch]);

    const onSearchButtonClick = (e) => {
        e.preventDefault();
        handleSearch();
    };

    // Display loading state for this page's data
    if (loading || authLoading) return <p style={{textAlign: 'center', padding: '5rem', fontSize: '1.5rem'}}>Loading available books...</p>;
    if (error) return <p style={{textAlign: 'center', color: 'red', padding: '5rem', fontSize: '1.5rem'}}>Error: {error}</p>;
    // Message when no books are found after loading and filtering
    if (allBooks.length === 0 && !loading) return <p style={{textAlign: 'center', padding: '5rem', fontSize: '1.5rem'}}>No books found in the library. Please add some!</p>;
    if (displayedBooks.length === 0 && !loading && allBooks.length > 0) return <p style={{textAlign: 'center', marginTop: '2rem', color: 'var(--text-medium)', gridColumn: '1 / -1'}}>No available books found in this category.</p>;

    // --- handleBorrowBook function defined correctly within component scope ---
    const handleBorrowBook = async (book) => {
        if (authLoading) { return; }

        // Use appUser for checks, as it's the reliable source after fetching
        if (!appUser) { 
            alert('Please log in to borrow books.');
            navigate('/login', { state: { from: `/books/${book.id}` } });
            return;
        }

        if (!book.isAvailable) {
            alert('This book is currently unavailable. Please try again later.');
            return;
        }

        let daysInput = prompt(`Do you want to borrow "${book.title}"? Enter number of days (1-7):`, "7");
        let daysToBorrow = parseInt(daysInput);

        if (isNaN(daysToBorrow) || daysToBorrow < 1 || daysToBorrow > 7) {
            alert("Invalid number of days. Please enter a number between 1 and 7.");
            return;
        }

        try {
            await borrowBook(appUser.uid, book.id, daysToBorrow); // Use appUser.uid
            alert(`"${book.title}" borrowed successfully for ${daysToBorrow} days! Check your dashboard.`);
            // Optimistic update: mark book as unavailable locally immediately
            setDisplayedBooks(prevBooks => prevBooks.map(b => b.id === book.id ? { ...b, isAvailable: false } : b));
            setAllBooks(prevBooks => prevBooks.map(b => b.id === book.id ? { ...b, isAvailable: false } : b));
        } catch (err) {
            console.error("Error borrowing book:", err);
            alert(`Failed to borrow book: ${err.message}`);
            if (err.message.includes("Book is not available for borrowing.") || err.message.includes("You have already borrowed this book.")) {
                alert("This book is already unavailable or you have borrowed it.");
            }
        }
    };
    // --- End handleBorrowBook ---

    return (
        <div className="admin-page-card"> {/* Reusing admin-page-card for general layout */}
            <h1 className="section-title">Browse Books</h1>
            <p style={{ color: 'var(--text-medium)', marginBottom: '2rem' }}>Select a book to borrow for up to 7 days.</p>

            <div className="search-bar-container" style={{ position: 'relative', maxWidth: '800px', margin: '0 auto 2rem auto' }}> 
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search by title, author, or genre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn" onClick={onSearchButtonClick}>Search</button>
                {searchTerm.length > 0 && (
                    <div className="search-results-container">
                        {searchLoading && <p className="search-message">Searching...</p>}
                        {!searchLoading && searchResults.length === 0 && <p className="search-message">No results found.</p>}
                        {searchResults.map(book => (
                            <Link to={`/books/${book.id}`} key={book.id} className="search-result-item" onClick={() => setSearchTerm('')}>
                                <img src={book.coverImageUrl} alt={book.title} className="search-result-image" />
                                <div className="search-result-details">
                                    <h4>{book.title}</h4>
                                    <p>{book.author}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="filter-controls" style={{ justifyContent: 'center' }}>
                <div className="genre-filters">
                    {dynamicGenres.map(genre => (
                        <button 
                            key={genre} 
                            className={`genre-btn ${activeGenre === genre ? 'active' : ''}`} 
                            onClick={() => setActiveGenre(genre)}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            </div>

            <div className="book-grid">
                {displayedBooks.length > 0 ? (
                    displayedBooks.map(book => (
                        <div key={book.id} className="book-card">
                            <img src={book.coverImageUrl} alt={book.title} />
                            <div className="book-card-content">
                                <h3 className="book-card-title">{book.title}</h3>
                                <p className="book-card-author">by {book.author}</p>
                                
                                <p className="book-availability" style={{ color: book.isAvailable ? 'green' : 'red' }}>
                                    {book.isAvailable ? 'Available' : 'Currently Rented'}
                                </p>

                                {book.isExclusive && <p style={{fontSize: '0.9rem', color: 'var(--color-primary)'}}>Price: ${book.price.toFixed(2)}</p>}
                                
                                {book.isAvailable ? (
                                    <button className="action-button borrow-button" onClick={() => handleBorrowBook(book)}>
                                        Borrow (7 days)
                                    </button>
                                ) : (
                                    <button className="action-button unavailable-button" disabled>
                                        Currently Rented
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-medium)', gridColumn: '1 / -1' }}>
                        No available books found in this category.
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserBorrowPage;