// src/components/Recommendations.js
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if different
import { Link } from "react-router-dom";

export default function Recommendations({ currentBookId, genre }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!genre) return;

    const fetchRecommendations = async () => {
      try {
        const q = query(
          collection(db, "books"),
          where("isAvailable", "==", true),
          where("genre", "==", genre) // since genre is a string
        );

        const snap = await getDocs(q);
        const recs = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(book => book.id !== currentBookId); // exclude current book

        setRecommendations(recs);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [currentBookId, genre]);

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-semibold mb-3">You may also like</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recommendations.map(book => (
          <li
            key={book.id}
            className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition"
          >
            <Link to={`/books/${book.id}`}>
              {book.coverImageUrl && (
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
              )}
              <span className="font-medium block">{book.title}</span>
              <p className="text-sm text-gray-500">{book.author}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
