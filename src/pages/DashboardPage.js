
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css'; // Dedicated CSS for Dashboard
import { doc, getDoc, getFirestore, collection, query, where, limit } from 'firebase/firestore'; // Import Firestore functions and query utilities
import { db } from '../firebaseConfig'; // Import Firestore instance
import { markBookAsReturned } from '../firebase/firestoreService'; // Import service function

const DashboardPage = () => {
    // Destructure necessary values from AuthContext
    const { user, loading: authLoading, logout, firebaseUser } = useAuth();
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null); // State for fetched user data
    const [pageLoading, setPageLoading] = useState(true); // Local loading state for this page's data fetch
    const [error, setError] = useState(null); // State for displaying errors

    // Function to fetch user-specific data from Firestore
    const fetchDashboardData = useCallback(async () => {
        // Ensure we have a firebaseUser before proceeding
        if (!firebaseUser) {
            console.log("fetchDashboardData: No firebaseUser, not fetching.");
            setPageLoading(false); // Stop loading if no user
            return;
        }

        try {
            console.log("Dashboard Debug: Fetching data for UID:", firebaseUser.uid);
            const userDocRef = doc(db, "users", firebaseUser.uid); // Reference to the user's document
            const userDocSnap = await getDoc(userDocRef); // Fetch the user document

            if (!userDocSnap.exists()) {
                console.error("Dashboard Debug: User document DOES NOT EXIST for UID:", firebaseUser.uid);
                throw new Error('User profile not found in Firestore.');
            }
            const fetchedUserData = userDocSnap.data(); // Get raw data
            console.log("Dashboard Debug: Raw fetchedUserData from Firestore:", fetchedUserData);

            let processedBorrowedBooks = []; // Initialize an empty array for processed books

            // Process borrowedBooks array to resolve book references
            if (fetchedUserData.borrowedBooks && fetchedUserData.borrowedBooks.length > 0) {
                console.log("Dashboard Debug: Raw borrowedBooks from Firestore (before map):", fetchedUserData.borrowedBooks);

                const populatedBorrowedBooks = await Promise.all(
    fetchedUserData.borrowedBooks.map(async (item, index) => {
        console.log(`Dashboard Debug: Processing borrowed item #${index}:`, item);

        // Validate that book is a DocumentReference
        if (!item?.book || typeof item.book.id !== "string") {
            console.warn("Dashboard Debug: Invalid borrowed book item:", item);
            return { ...item, book: null };
        }

        try {
            const bookDoc = await getDoc(item.book);
            console.log(`Dashboard Debug: Book reference #${index} resolved for ID: ${item.book.id}, Exists: ${bookDoc.exists()}`);

            return {
                ...item,
                book: bookDoc.exists() ? { id: bookDoc.id, ...bookDoc.data() } : null
            };
        } catch (docError) {
            console.error(`Dashboard Debug: Error fetching book doc (index ${index}):`, docError);
            return { ...item, book: null };
        }
    })
);

                // Filter out any entries where book data couldn't be fetched or was invalid (null book)
                processedBorrowedBooks = populatedBorrowedBooks.filter(item => item !== null && item.book !== null);
                console.log("Dashboard Debug: Final fetched borrowedBooks array (after null filter):", processedBorrowedBooks);
            } else {
                console.log("Dashboard Debug: fetchedUserData.borrowedBooks is empty or not an array.");
            }
            
            // Update the state with processed data
            setDashboardData({ ...fetchedUserData, borrowedBooks: processedBorrowedBooks });
            console.log("Dashboard Debug: setDashboardData called with:", { ...fetchedUserData, borrowedBooks: processedBorrowedBooks });

        } catch (err) {
            setError(err.message);
            console.error("Dashboard Debug: Error in fetchDashboardData catch block:", err);
            if (err.code === 'permission-denied') {
                alert("Permission denied to access profile. Check Firestore Rules or login status.");
                logout();
                navigate('/login');
            } else if (err.message.includes("Failed to fetch") || err.message.includes("Network")) {
                alert("Network error. Please try again later.");
                logout();
                navigate('/login');
            }
        } finally {
            setPageLoading(false);
            console.log("Dashboard Debug: pageLoading set to false.");
        }
    }, [firebaseUser, logout, navigate]); // Dependencies for useCallback

    // Effect to trigger data fetching and redirection
    useEffect(() => {
        // Ensure user is authenticated and auth loading is complete before fetching data
        if (firebaseUser && !authLoading) {
            fetchDashboardData();
        } else if (!firebaseUser && !authLoading) { // If not logged in after auth check, redirect
            alert("You need to be logged in to access this page.");
            logout();
            navigate('/login');
        }
    }, [firebaseUser, authLoading, fetchDashboardData, logout, navigate]); // Dependencies for useEffect

    // Display loading state for the page itself
    if (authLoading || pageLoading) {
        return <div className="dashboard-container"><p className="dashboard-placeholder-text">Loading your dashboard...</p></div>;
    }

    // Display error state
    if (error) {
        return <div className="dashboard-container" style={{ color: 'red' }}><p className="dashboard-placeholder-text">Error: {error}</p></div>;
    }

    // If somehow firebaseUser is null after all checks (should be caught by redirect above)
    if (!firebaseUser) {
        return <div className="dashboard-container"><p className="dashboard-placeholder-text">Redirecting to login...</p></div>;
    }

    // Handler for "Resume Reading" button
    const handleResumeReading = (pdfUrl) => {
        if (pdfUrl) {
            window.open(pdfUrl, '_blank');
        } else {
            alert('PDF not available for this book.');
        }
    };

    // Handler for "Return Book" button
    const handleReturnBook = async (bookId, borrowedDate) => {
        if (window.confirm('Are you sure you want to mark this book as returned?')) {
            try {
                // Ensure user is authenticated before proceeding
                if (!firebaseUser || !user) { throw new Error('User not authenticated.'); }
                await markBookAsReturned(firebaseUser.uid, bookId, borrowedDate);
                alert('Book marked as returned!');
                fetchDashboardData(); // Re-fetch data to update the dashboard
            } catch (err) {
                alert(`Error returning book: ${err.message}`);
                console.error("Error returning book:", err);
                if (err.code === 'permission-denied') {
                    alert("Permission denied. Check Firestore Rules.");
                }
            }
        }
    };

    // Helper to calculate days remaining
    const getDaysRemaining = (dueDate) => {
        if (!dueDate) return 'N/A'; // Handle case where dueDate might be missing
        const now = new Date();
        const due = dueDate.toDate(); // Convert Firestore Timestamp to JS Date
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days

        // Display remaining days or expired status
        return diffDays > 0 ? `${diffDays} days remaining` : 'Expired';
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                {/* Display user avatar, name, and email */}
                <img src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="User avatar" className="dashboard-avatar" />
                <h1 className="dashboard-welcome-message">Welcome back, {user?.name || firebaseUser.email}!</h1>
                <p className="dashboard-sub-header">Here’s a snapshot of your reading journey.</p>
            </div>

            {/* Admin Panel Link - conditionally rendered */}
            {user?.role === 'admin' && (
                <div className="dashboard-admin-panel">
                    <h2>Admin Tools</h2>
                    <p>You have administrative privileges.</p>
                    <Link to="/admin/dashboard" className="dashboard-admin-link">Go to Admin Control Panel</Link>
                </div>
            )}

            <div className="dashboard-main-grid">
                {/* Continue Reading Section */}
              {/* Continue Reading Section */}
<div className="dashboard-card">
  <h2>Continue Reading</h2>
  {dashboardData?.borrowedBooks && dashboardData.borrowedBooks.length > 0 ? (
    dashboardData.borrowedBooks
      .filter(item => !item.returnDate) // Only active borrowed books
      .map(item => (
        item.book ? (
          <div key={item.book.id} className="dashboard-continue-reading-item">
            {/* Left: Book Cover */}
            <img 
              src={item.book.coverImageUrl} 
              alt={item.book.title} 
              className="dashboard-continue-reading-cover" 
            />

            {/* Right: Book Info */}
            <div className="dashboard-continue-reading-details">
              <h3>{item.book.title}</h3>
              <p>by {item.book.author}</p>
              <p>
                Due Date:{" "}
                {item.dueDate ? new Date(item.dueDate.toDate()).toLocaleDateString() : "N/A"}
              </p>
              <p>{getDaysRemaining(item.dueDate)}</p>

              {/* Progress bar */}
              <div className="dashboard-progress-bar-container">
                <div className="progress-bar">
  
</div>
              </div>

              {/* Resume Reading Button */}
              <button 
                className="dashboard-resume-button"
                onClick={() => handleResumeReading(item.book?.pdfUrl)}
              >
                Resume Reading
              </button>
            </div>
          </div>
        ) : null
      ))
  ) : (
    <p className="dashboard-placeholder-text">
      No books in progress. Start reading something!
    </p>
  )}
</div>

                {/* Reading Activity Section */}
                
            </div>

            {/* Currently Borrowed Books Section */}
            <div className="dashboard-card dashboard-full-width-card">
                <h2>Currently Borrowed Books</h2>
                {dashboardData?.borrowedBooks && dashboardData.borrowedBooks.length > 0 ? (
                    <div className="dashboard-borrowed-books-grid">
                        {dashboardData.borrowedBooks
                            .filter(item => !item.returnDate) // Show only books not yet returned
                            .map(item => (
                                item.book ? ( // CRITICAL: Check if item.book is NOT null
                                    <div key={item.book.id} className="dashboard-borrowed-book-item">
                                        <img src={item.book.coverImageUrl} alt={item.book.title} className="dashboard-borrowed-book-cover" />
                                        <div className="dashboard-borrowed-book-details">
                                            <h3>{item.book.title}</h3>
                                            <p>by {item.book.author}</p>
                                            <p>Due Date: {item.dueDate ? new Date(item.dueDate.toDate()).toLocaleDateString() : 'N/A'}</p>
                                            <button 
                                                className="dashboard-return-button"
                                                onClick={() => handleReturnBook(item.book.id, item.borrowDate)}
                                            >
                                                Return Book
                                            </button>
                                        </div>
                                    </div>
                                ) : null // Render nothing if item.book is null
                            ))}
                    </div>
                ) : (
                    <p className="dashboard-placeholder-text">You currently have no borrowed books.</p>
                )}
            </div>

           

            <button className="dashboard-logout-button" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default DashboardPage;