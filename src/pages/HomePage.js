// src/pages/HomePage.js - FINAL VERSION with Corrected Search and Recommendations

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';
import './HomePageSearch.css';
import { FaMicrophone } from 'react-icons/fa'; // Keep for potential future use
import {
    BsLightningChargeFill, BsCartCheckFill, BsHeadset, BsPeopleFill,
    BsShieldLockFill, BsLaptop, BsLightbulb, BsGraphUpArrow
} from 'react-icons/bs';
import { getBooks, searchBooks } from '../firebase/firestoreService';

const featuresData = [
    { icon: <BsLightningChargeFill />, title: "Instant Book Borrowing", text: "Access and borrow books from our vast digital library in a single click." },
    { icon: <BsCartCheckFill />, title: "Easy Purchase", text: "Own your favorite books forever with our seamless and secure purchase options." },
    { icon: <BsHeadset />, title: "24x7 Service Access", text: "Our library never closes. Read anytime, anywhere, on your schedule." },
    { icon: <BsPeopleFill />, title: "Community Reviews", text: "Engage with fellow readers, share insights, and find your next book." },
    { icon: <BsShieldLockFill />, title: "Secure & Private", text: "Your reading data is yours alone. We prioritize your privacy with top-tier security." },
    { icon: <BsLaptop />, title: "Multi-device Sync", text: "Start reading on your tablet and continue on your phone. Your progress is always saved." },
    { icon: <BsLightbulb />, title: "Smart Recommendations", text: "Get personalized book suggestions powered by AI that match your interests." },
    { icon: <BsGraphUpArrow />, title: "Reading Analytics", text: "Track your reading time, pace, and preferences to improve your habits." },
];

const HomePage = () => {
    const [allBooks, setAllBooks] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [visibleRecs, setVisibleRecs] = useState(0);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [activeGenre, setActiveGenre] = useState('All Genres');
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const [dynamicGenres, setDynamicGenres] = useState(['All Genres']);

    const { user, loading: authLoading } = useAuth(); // Get user and authLoading
    const navigate = useNavigate(); // Needed for redirects

    // Fetch all books and extract unique genres
    useEffect(() => {
        const fetchBooksAndGenres = async () => {
            try {
                const data = await getBooks(100);
                setAllBooks(data);
                setFilteredBooks(data);
                
                const availableBooks = data.filter(book => book.isAvailable);

                let recommendedBooks = [];
                if (data.length > 0) {
                    const staffPick = data[0];
                    if (staffPick && staffPick.isAvailable && staffPick.genre) {
                        const staffPickGenre = staffPick.genre;
                        const booksInStaffPickGenre = availableBooks.filter(book => 
                            book.genre && book.genre.toLowerCase() === staffPickGenre.toLowerCase()
                        );
                        recommendedBooks = booksInStaffPickGenre.slice(0, 5);
                    }
                }
                if (recommendedBooks.length < 5) {
                    const remainingNeeded = 5 - recommendedBooks.length;
                    const otherAvailableBooks = availableBooks.filter(book => 
                        !recommendedBooks.some(rec => rec.id === book.id)
                    );
                    recommendedBooks = recommendedBooks.concat(otherAvailableBooks.slice(0, remainingNeeded));
                }
                
                setRecommendations(recommendedBooks);

                const uniqueGenres = ['All Genres', ...new Set(data.map(book => book.genre).filter(Boolean))];
                setDynamicGenres(uniqueGenres.sort());
            } catch (error) {
                console.error("Failed to fetch featured books or genres from Firestore:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooksAndGenres();
    }, []);

    // Effect for pulsating recommendations animation
    useEffect(() => {
        if (recommendations.length > 0) {
            const timer = setInterval(() => {
                setVisibleRecs(prev => {
                    if (prev < recommendations.length) return prev + 1;
                    clearInterval(timer);
                    return prev;
                });
            }, 300);
            return () => clearInterval(timer);
        }
    }, [recommendations]);

    // Effect for genre filtering
    useEffect(() => {
        if (activeGenre === 'All Genres') {
            setFilteredBooks(allBooks);
        } else {
            const filtered = allBooks.filter(book => 
                book.genre && book.genre.toLowerCase() === activeGenre.toLowerCase()
            );
            setFilteredBooks(filtered);
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
            // Fetch ALL books to filter client-side for 'contains' search
            const allBooksForSearch = await getBooks(); // Fetch all books
            const results = allBooksForSearch.filter(book => {
                return (
                    book.title_lower?.includes(searchTerm.toLowerCase()) ||
                    book.author_lower?.includes(searchTerm.toLowerCase()) ||
                    book.genre_lower?.includes(searchTerm.toLowerCase())
                );
            });
            setSearchResults(results);
        } catch (error) {
            console.error("Error during live search:", error);
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
        handleSearch();
    };

    // Staff pick logic (assuming it's the first book fetched)
    const staffPick = allBooks.length > 0 ? allBooks[0] : null;

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '5rem', fontSize: '1.5rem' }}>Loading BookCore...</div>;
    }

    return (
        <div className="homepage-container">
            {staffPick && (
                <section className="hero-search-section">
                    <p className="hero-tag">Staff Pick of the Week</p>
                    <h1 className="hero-title">{staffPick.title}</h1>
                    <p className="hero-description">{staffPick.description}</p>
                    {/* Link to book detail page, conditionally showing button based on availability */}
                    {staffPick.isAvailable ? (
                        <Link to={`/books/${staffPick.id}`} className="hero-button">Read Now</Link>
                    ) : (
                        <button className="hero-rented-button" disabled>Currently Rented</button>
                    )}
                    
                    <div className="search-bar-container" style={{ position: 'relative' }}>
                        <input 
                            type="text" 
                            className="search-input" 
                            placeholder="AI-powered search for books, authors, or genres..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-btn" onClick={onSearchButtonClick}>Search</button>
                        
                        {/* Live search results dropdown */}
                        {searchTerm.length > 0 && (
                            <div className="search-results-container">
                                {searchLoading && <p className="search-message">Searching...</p>}
                                {!searchLoading && searchResults.length === 0 && <p className="search-message">No results found.</p>}
                                {searchResults.map(book => (
                                    <Link to={`/books/${book.id}`} key={book.id} className="search-result-item">
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
            )}

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
                <section className="recommendation-section">
                    <h2 className="section-title">Fresh Recommendations For You</h2>
                    <div className="pulsating-books-container">
                        {recommendations.slice(0, visibleRecs).map((book, index) => (
                            <div key={book.id} className={`pulsating-book ${index === visibleRecs - 1 ? 'animate-pulse' : ''}`}>
                                <Link to={`/books/${book.id}`}>
                                    <img src={book.coverImageUrl} alt={book.title} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Library Section with Genre Filters */}
            <section className="library-section">
                <div className="filter-controls">
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
                    {filteredBooks.map(book => (
                        <Link to={`/books/${book.id}`} key={book.id} className="book-card">
                            <img src={book.coverImageUrl} alt={book.title} />
                            <div className="book-card-content">
                                <h3 className="book-card-title">{book.title}</h3>
                                <p className="book-card-author">by {book.author}</p>
                                {/* Display availability and price */}
                                <p className="book-availability" style={{ color: book.isAvailable ? 'green' : 'red' }}>
                                    {book.isAvailable ? 'Available' : 'Currently Rented'}
                                </p>
                                {book.isExclusive && book.price > 0 && (
                                    <p style={{fontSize: '0.9rem', color: 'var(--color-primary)'}}>Price: ${book.price.toFixed(2)}</p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            
            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Why Choose BookCore?</h2>
                <div className="features-grid">
                    {featuresData.map((feature, index) => (
                        <div className="feature-card" key={index}>
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;