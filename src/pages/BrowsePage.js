// src/pages/BrowsePage.js - FINAL with Search Bar and Full Book Display

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBooks, searchBooks, borrowBook } from '../firebase/firestoreService'; // Import searchBooks
import './HomePage.css'; // Reusing general homepage styles like .library-section, .book-grid
import './HomePageSearch.css'; // For search results dropdown styles

const BrowsePage = () => {
    const [allBooks, setAllBooks] = useState([]); // All books for filtering
    const [displayedBooks, setDisplayedBooks] = useState([]); // Books currently shown in the grid
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const [searchResults, setSearchResults] = useState([]); // State for live search results
    const [searchLoading, setSearchLoading] = useState(false); // State for search loading

    const [activeGenre, setActiveGenre] = useState('All Genres');
    const [dynamicGenres, setDynamicGenres] = useState(['All Genres']); // Dynamic genres state

    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Fetch all books for initial display and genre extraction
    useEffect(() => {
        const fetchBooksAndGenres = async () => {
            try {
                const data = await getBooks(); // Fetch all books (no limit)
                setAllBooks(data);
                setDisplayedBooks(data); // Initially display all books
                
                // Extract unique genres
                const uniqueGenres = ['All Genres', ...new Set(data.map(book => book.genre).filter(Boolean))];
                setDynamicGenres(uniqueGenres.sort());
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch books for browse page from Firestore:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooksAndGenres();
    }, []);

    // Effect for genre filtering
    useEffect(() => {
        if (activeGenre === 'All Genres') {
            setDisplayedBooks(allBooks);
        } else {
            const filtered = allBooks.filter(book => 
                book.genre && book.genre.toLowerCase() === activeGenre.toLowerCase()
            );
            setDisplayedBooks(filtered);
        }
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
            // Use the searchBooks service function
            const results = await searchBooks(searchTerm.toLowerCase());
            setSearchResults(results);
        } catch (error) {
            console.error("Error during live search on BrowsePage:", error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, [searchTerm]);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            handleSearch();
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, handleSearch]);

    const onSearchButtonClick = (e) => {
        e.preventDefault();
        handleSearch(); // Trigger immediate search
    };

    const handleBorrowBook = (book) => {
        if (authLoading) { return; }

        if (!user) {
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

        borrowBook(user.uid, book.id, daysToBorrow)
            .then(() => {
                alert(`"${book.title}" borrowed successfully for ${daysToBorrow} days! Check your dashboard.`);
                // Optimistic update: mark book as unavailable locally
                setDisplayedBooks(prevBooks => prevBooks.map(b => b.id === book.id ? { ...b, isAvailable: false } : b));
                setAllBooks(prevBooks => prevBooks.map(b => b.id === book.id ? { ...b, isAvailable: false } : b));
            })
            .catch(err => {
                console.error("Error borrowing book:", err);
                alert(`Failed to borrow book: ${err.message}`);
                if (err.message.includes("Book is not available for borrowing.") || err.message.includes("You have already borrowed this book.")) {
                    alert("This book is already unavailable or you have borrowed it.");
                }
            });
    };

    if (loading) return <p style={{textAlign: 'center', padding: '5rem', fontSize: '1.5rem'}}>Loading the full collection...</p>;
    if (error) return <p style={{textAlign: 'center', color: 'red', padding: '5rem', fontSize: '1.5rem'}}>Error: {error}</p>;
    if (allBooks.length === 0 && !loading) return <p style={{textAlign: 'center', padding: '5rem', fontSize: '1.5rem'}}>No books found in the library. Please add some!</p>;

    return (
        <div className="homepage-container"> {/* Reusing homepage container styles */}
            <section className="hero-search-section" style={{ padding: '2rem', marginBottom: '2rem', background: 'none', boxShadow: 'none' }}> {/* Simplified hero section for browse page */}
                <h1 className="section-title" style={{ marginTop: '0', marginBottom: '1.5rem' }}>Browse Our Collection</h1>
                <div className="search-bar-container" style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}> 
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
                                <Link to={`/books/${book.id}`} key={book.id} className="search-result-item" onClick={() => setSearchTerm('')}> {/* Clear search on click */}
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
            </section>

            <section className="library-section">
                <div className="filter-controls">
                    <div className="genre-filters">
                        {dynamicGenres.map(genre => (
                            <button key={genre} className={`genre-btn ${activeGenre === genre ? 'active' : ''}`} onClick={() => setActiveGenre(genre)}>
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="book-grid">
                    {displayedBooks.map(book => (
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
                    ))}
                </div>
            </section>
        </div>
    );
};

export default BrowsePage;