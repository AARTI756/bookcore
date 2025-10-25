// DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { markBookAsReturned } from '../firebase/firestoreService';

// 📊 Import Recharts
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const DashboardPage = () => {
  const { user, loading: authLoading, logout, firebaseUser } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genresExplored, setGenresExplored] = useState(0);

  const fetchDashboardData = useCallback(async () => {
    if (!firebaseUser) {
      setPageLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error('User profile not found in Firestore.');
      }
      const fetchedUserData = userDocSnap.data();

      let processedBorrowedBooks = [];
      if (fetchedUserData.borrowedBooks && fetchedUserData.borrowedBooks.length > 0) {
        const populatedBorrowedBooks = await Promise.all(
          fetchedUserData.borrowedBooks.map(async (item) => {
            if (!item?.book || typeof item.book.id !== 'string') {
              return { ...item, book: null };
            }
            try {
              const bookDoc = await getDoc(item.book);
              return {
                ...item,
                book: bookDoc.exists() ? { id: bookDoc.id, ...bookDoc.data() } : null,
              };
            } catch {
              return { ...item, book: null };
            }
          })
        );

        processedBorrowedBooks = populatedBorrowedBooks.filter((item) => item.book !== null);
      }

      // ✅ Calculate genres explored
      const genreSet = new Set();
      for (const borrowed of processedBorrowedBooks) {
        if (borrowed.book?.genre) {
          genreSet.add(borrowed.book.genre);
        }
      }
      setGenresExplored(genreSet.size);

      setDashboardData({ ...fetchedUserData, borrowedBooks: processedBorrowedBooks });
    } catch (err) {
      setError(err.message);
      if (err.code === 'permission-denied') {
        alert('Permission denied. Check Firestore Rules.');
        logout();
        navigate('/login');
      }
    } finally {
      setPageLoading(false);
    }
  }, [firebaseUser, logout, navigate]);

  useEffect(() => {
    if (firebaseUser && !authLoading) {
      fetchDashboardData();
    } else if (!firebaseUser && !authLoading) {
      alert('You need to be logged in to access this page.');
      logout();
      navigate('/login');
    }
  }, [firebaseUser, authLoading, fetchDashboardData, logout, navigate]);

  if (authLoading || pageLoading) {
    return (
      <div className="dashboard-container">
        <p className="dashboard-placeholder-text">Loading your dashboard...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="dashboard-container" style={{ color: 'red' }}>
        <p className="dashboard-placeholder-text">Error: {error}</p>
      </div>
    );
  }
  if (!firebaseUser) {
    return (
      <div className="dashboard-container">
        <p className="dashboard-placeholder-text">Redirecting to login...</p>
      </div>
    );
  }

  // 📊 Chart Data Builders
  const borrowedBooks = dashboardData?.borrowedBooks || [];
  const returnedBooks = borrowedBooks.filter((b) => b.returnDate).length;
  const activeBorrows = borrowedBooks.length - returnedBooks;

  const borrowReturnData = [
    { name: 'Borrowed', value: activeBorrows },
    { name: 'Returned', value: returnedBooks },
  ];

  const genreCounts = {};
  borrowedBooks.forEach((item) => {
    if (item.book?.genre) {
      genreCounts[item.book.genre] = (genreCounts[item.book.genre] || 0) + 1;
    }
  });
  const genreData = Object.entries(genreCounts).map(([genre, count]) => ({
    name: genre,
    value: count,
  }));

  const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#f4bf4dff', '#AF19FF', '#f81436ff', '#511ef9ff', '#00E396',  '#f334a6ff'];

  const handleResumeReading = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      alert('PDF not available for this book.');
    }
  };

  const handleReturnBook = async (bookId) => {
    if (window.confirm('Are you sure you want to mark this book as returned?')) {
      try {
        if (!firebaseUser || !user) {
          throw new Error('User not authenticated.');
        }
        await markBookAsReturned(firebaseUser.uid, bookId);
        alert('Book marked as returned!');
        fetchDashboardData();
      } catch (err) {
        alert(`Error returning book: ${err.message}`);
      }
    }
  };

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return 'N/A';
    const now = new Date();
    const due = dueDate.toDate();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days remaining` : 'Expired';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <img
          src={
            user?.picture ||
            `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`
          }
          alt="User avatar"
          className="dashboard-avatar"
        />
        <h1 className="dashboard-welcome-message">
          Welcome back, {user?.name || firebaseUser.email}!
        </h1>
        <p className="dashboard-sub-header">Here’s a snapshot of your reading journey.</p>
      </div>

      {/* 📌 Stats Row */}
      <div className="dashboard-stats-row">
        <div className="dashboard-stat-card">
          <h3>Total Books Read</h3>
          <p>{returnedBooks}</p>
        </div>
        <div className="dashboard-stat-card">
          <h3>Genres Explored</h3>
          <p>{genresExplored}</p>
        </div>
      </div>

      {/* ✅ Charts & Continue Reading */}
      <div className="dashboard-main-grid">
        {/* 📊 Borrow vs Returned */}
        <div className="dashboard-card">
          <h2>Borrowed vs Returned</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={borrowReturnData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {borrowReturnData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🎭 Genres Distribution */}
        <div className="dashboard-card">
          <h2>Genres Distribution</h2>
          <ResponsiveContainer width="100%" height={330}>
            <PieChart>
              <Pie
                data={genreData}
                dataKey="value"
                cx="50%"
                cy="40%"
                outerRadius={80}
                label
              >
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 📖 Continue Reading */}
<div className="dashboard-card dashboard-full-width-card">
  <h2>Continue Reading</h2>
  {borrowedBooks.length > 0 ? (
    <div className="dashboard-continue-row">
      {borrowedBooks
        .filter((item) => !item.returnDate)
        .map((item) =>
          item.book ? (
            <div key={item.book.id} className="dashboard-continue-item">
              <img
                src={item.book.coverImageUrl}
                alt={item.book.title}
                className="dashboard-continue-cover"
              />
              <div className="dashboard-continue-details">
                <h3>{item.book.title}</h3>
                <p>by {item.book.author}</p>
                <p>
                  Due Date:{' '}
                  {item.dueDate
                    ? new Date(item.dueDate.toDate()).toLocaleDateString()
                    : 'N/A'}
                </p>
                <p>{getDaysRemaining(item.dueDate)}</p>
                <button
                  className="dashboard-resume-button"
                  onClick={() => handleResumeReading(item.book?.pdfUrl)}
                >
                  Resume Reading
                </button>
              </div>
            </div>
          ) : null
        )}
    </div>
  ) : (
    <p className="dashboard-placeholder-text">
      No books in progress. Start reading something!
    </p>
  )}
</div>

      </div>

      {/* 📚 Currently Borrowed Books (Horizontal Grid) */}
      <div className="dashboard-card dashboard-full-width-card">
        <h2>Currently Borrowed Books</h2>
        {borrowedBooks.length > 0 ? (
          <div className="dashboard-borrowed-books-row">
            {borrowedBooks
              .filter((item) => !item.returnDate)
              .map((item) =>
                item.book ? (
                  <div key={item.book.id} className="dashboard-borrowed-book-item">
                    <img
                      src={item.book.coverImageUrl}
                      alt={item.book.title}
                      className="dashboard-borrowed-book-cover"
                    />
                    <div className="dashboard-borrowed-book-details">
                      <h3>{item.book.title}</h3>
                      <p>by {item.book.author}</p>
                      <p>
                        Due Date:{' '}
                        {item.dueDate
                          ? new Date(item.dueDate.toDate()).toLocaleDateString()
                          : 'N/A'}
                      </p>
                      <button
                        className="dashboard-return-button"
                        onClick={() => handleReturnBook(item.book.id)}
                      >
                        Return Book
                      </button>
                    </div>
                  </div>
                ) : null
              )}
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
