import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Recharts
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Chart.js
import { Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
);

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [bookCount, setBookCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [genreData, setGenreData] = useState([]);
  const [popularGenres, setPopularGenres] = useState([]);
  const [borrowTrends, setBorrowTrends] = useState([]);
  const [timeGranularity, setTimeGranularity] = useState("month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch role
  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role || "user");
        } else {
          setRole("user");
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        setError(err.message);
      }
    };
    fetchRole();
  }, [user]);

  // Fetch analytics
  const fetchCounts = useCallback(async () => {
    if (!user || role !== "admin") {
      setLoading(false);
      return;
    }
    try {
      // Users
      const usersSnapshot = await getDocs(collection(db, "users"));
      setUserCount(usersSnapshot.size);

      // Books
      const booksSnapshot = await getDocs(collection(db, "books"));
      setBookCount(booksSnapshot.size);

      // Books by Genre
      const genreMap = {};
      booksSnapshot.forEach((docSnap) => {
        const book = docSnap.data();
        const genre = book.genre || "Unknown";
        genreMap[genre] = (genreMap[genre] || 0) + 1;
      });
      setGenreData(
        Object.keys(genreMap).map((g) => ({ genre: g, count: genreMap[g] }))
      );

      // Borrow stats
      const genrePopularity = {};
      const trends = {};

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        if (Array.isArray(userData.borrowedBooks)) {
          for (const borrow of userData.borrowedBooks) {
            // Genre popularity
            if (borrow.book) {
              try {
                const bookDoc = await getDoc(borrow.book);
                if (bookDoc.exists()) {
                  const bookData = bookDoc.data();
                  const genre = bookData.genre || "Unknown";
                  genrePopularity[genre] = (genrePopularity[genre] || 0) + 1;
                }
              } catch (err) {
                console.warn("Error fetching book ref:", err);
              }
            }

            // Trends by selected granularity
            if (borrow.borrowDate) {
              const date = new Date(borrow.borrowDate.seconds * 1000);
              let key = "";

              if (timeGranularity === "day") {
                key = date.toISOString().split("T")[0]; // YYYY-MM-DD
              } else if (timeGranularity === "month") {
                key = `${date.getFullYear()}-${String(
                  date.getMonth() + 1
                ).padStart(2, "0")}`;
              } else if (timeGranularity === "year") {
                key = `${date.getFullYear()}`;
              }

              trends[key] = (trends[key] || 0) + 1;
            }
          }
        }
      }

      // Save aggregated data
      setPopularGenres(
        Object.keys(genrePopularity).map((g) => ({
          genre: g,
          count: genrePopularity[g],
        }))
      );
      setBorrowTrends(
        Object.keys(trends)
          .sort((a, b) => new Date(a) - new Date(b))
          .map((m) => ({ period: m, borrows: trends[m] }))
      );
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, role, timeGranularity]);

  useEffect(() => {
    if (role) fetchCounts();
  }, [role, fetchCounts]);

  // UI states
  if (!user) {
    return (
      <div className="admin-page-card">
        <p>Please log in.</p>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="admin-page-card">
        <p>Access Denied: You must be an admin.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-page-card">
        <p>Loading admin data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page-card" style={{ color: "red" }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="admin-page-card">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.email}!</p>

      {/* Counts */}
      <div style={styles.countsGrid}>
        <div style={styles.countCard}>
          <h3>Total Users</h3>
          <p style={styles.countValue}>{userCount}</p>
        </div>
        <div style={styles.countCard}>
          <h3>Total Books</h3>
          <p style={styles.countValue}>{bookCount}</p>
        </div>
      </div>

      {/* Grid layout for charts */}
      <div style={styles.chartsGrid}>
        <GenreDonut data={genreData} />
        <PopularGenresPie data={popularGenres} />
      </div>

      {/* Line Chart → Borrowing Trends with filter */}
      <BorrowTrendsLine
        data={borrowTrends}
        timeGranularity={timeGranularity}
        setTimeGranularity={setTimeGranularity}
      />
    </div>
  );
};

// 📊 Books by Genre Donut
const GenreDonut = ({ data }) => {
  if (!data || data.length === 0) return <p>No genre data available.</p>;

  const chartData = {
    labels: data.map((d) => d.genre),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <div style={styles.chartCard}>
      <h2 style={{ textAlign: "center" }}>Books by Genre</h2>
      <div style={styles.scrollContainer}>
        <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

// 📊 Popular Genres Pie
const PopularGenresPie = ({ data }) => {
  if (!data || data.length === 0) return <p>No popular genre data available.</p>;

  const chartData = {
    labels: data.map((d) => d.genre),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div style={styles.chartCard}>
      <h2 style={{ textAlign: "center" }}>Popular Genres (by Borrows)</h2>
      <div style={styles.scrollContainer}>
        <Pie data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

// 📊 Borrowing Trends Line with filter
const BorrowTrendsLine = ({ data, timeGranularity, setTimeGranularity }) => {
  if (!data || data.length === 0) return <p>No borrowing trend data available.</p>;

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Borrowing Activity Over Time</h2>

      {/* Filter Toggle */}
      <div style={{ marginBottom: "10px" }}>
        <label>View by: </label>
        <select
          value={timeGranularity}
          onChange={(e) => setTimeGranularity(e.target.value)}
          style={{ padding: "5px", marginLeft: "10px" }}
        >
          <option value="day">Day</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="borrows"
            stroke="#2563eb"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Styles
const styles = {
  countsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "10px",
    textAlign: "center",
  },
  countCard: {
    background: "var(--bg-primary)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px var(--shadow-light)",
    border: "1px solid var(--border-color)",
  },
  countValue: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "var(--color-primary)",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "30px",
  },
  chartCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    height: "400px",
    overflow: "hidden",
  },
  scrollContainer: {
    height: "300px",
    overflowY: "auto",
    padding: "10px",
  },
};

export default AdminDashboardPage;
