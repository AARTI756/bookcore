// src/firebase/firestoreService.js - FINAL FIXED FOR FIREBASE v9
import {
  collection, where, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, limit, setDoc, arrayRemove, arrayUnion,
  orderBy, startAt, endAt, runTransaction
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from '../firebaseConfig';


// --- BOOKS COLLECTION ---
const booksCollectionRef = collection(db, "books");

export const getBorrowedBooksByUser = async (userId) => {
  const q = query(
    collection(db, "borrowedBooks"), 
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getBooks = async (limitCount = 0) => {
  let booksQuery = booksCollectionRef;
  if (limitCount > 0) {
    booksQuery = query(booksCollectionRef, limit(limitCount));
  }
  const snapshot = await getDocs(booksQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getBookById = async (id) => {
  const docRef = doc(db, "books", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Book not found.");
  }
};

export const addBook = async (bookData, coverFile, pdfFile) => {
  let coverImageUrl = '';
  let pdfUrl = '';

  if (coverFile) {
    const coverRef = ref(storage, `book_covers/${coverFile.name + '_' + Date.now()}`);
    await uploadBytes(coverRef, coverFile);
    coverImageUrl = await getDownloadURL(coverRef);
  }

  if (pdfFile) {
    const pdfRef = ref(storage, `book_pdfs/${pdfFile.name + '_' + Date.now()}`);
    await uploadBytes(pdfRef, pdfFile);
    pdfUrl = await getDownloadURL(pdfRef);
  }

  const newBookRef = doc(booksCollectionRef);
  await setDoc(newBookRef, {
    ...bookData,
    coverImageUrl,
    pdfUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { id: newBookRef.id, ...bookData, coverImageUrl, pdfUrl };
};

export const updateBook = async (id, bookData, coverFile, pdfFile) => {
  const docRef = doc(db, "books", id);
  let updatedData = { ...bookData, updatedAt: new Date() };

  if (coverFile) {
    const coverRef = ref(storage, `book_covers/${coverFile.name + '_' + Date.now()}`);
    await uploadBytes(coverRef, coverFile);
    updatedData.coverImageUrl = await getDownloadURL(coverRef);
  }

  if (pdfFile) {
    const pdfRef = ref(storage, `book_pdfs/${pdfFile.name + '_' + Date.now()}`);
    await uploadBytes(pdfRef, pdfFile);
    updatedData.pdfUrl = await getDownloadURL(pdfRef);
  }

  await updateDoc(docRef, updatedData);
  return { id, ...updatedData };
};

export const deleteBook = async (id) => {
  const docRef = doc(db, "books", id);
  await deleteDoc(docRef);
};

export const searchBooks = async (searchTerm, limitCount = 5) => {
  if (!searchTerm) return [];

  const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
  
  const titleQuery = query(
    booksCollectionRef,
    orderBy('title_lower'),
    startAt(lowerCaseSearchTerm),
    endAt(lowerCaseSearchTerm + '\uf8ff'),
    limit(limitCount)
  );
  const authorQuery = query(
    booksCollectionRef,
    orderBy('author_lower'),
    startAt(lowerCaseSearchTerm),
    endAt(lowerCaseSearchTerm + '\uf8ff'),
    limit(limitCount)
  );
  const genreQuery = query(
    booksCollectionRef,
    orderBy('genre_lower'),
    startAt(lowerCaseSearchTerm),
    endAt(lowerCaseSearchTerm + '\uf8ff'),
    limit(limitCount)
  );

  const [titleSnapshot, authorSnapshot, genreSnapshot] = await Promise.all([
    getDocs(titleQuery),
    getDocs(authorQuery),
    getDocs(genreQuery)
  ]);

  const resultsMap = new Map();
  titleSnapshot.docs.forEach(doc => resultsMap.set(doc.id, { id: doc.id, ...doc.data() }));
  authorSnapshot.docs.forEach(doc => resultsMap.set(doc.id, { id: doc.id, ...doc.data() }));
  genreSnapshot.docs.forEach(doc => resultsMap.set(doc.id, { id: doc.id, ...doc.data() }));
  
  return Array.from(resultsMap.values());
};


// --- USERS COLLECTION ---
const usersCollectionRef = collection(db, "users");

export const getAllUsers = async () => {
  const snapshot = await getDocs(usersCollectionRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteUserFromFirestore = async (uid) => {
  const userDocRef = doc(db, "users", uid);
  await deleteDoc(userDocRef);
};


// --- ORDERS COLLECTION ---
const ordersCollectionRef = collection(db, "orders");

export const getOrders = async () => {
  const snapshot = await getDocs(ordersCollectionRef);
  const orders = [];
  for (const orderDoc of snapshot.docs) {
    const orderData = orderDoc.data();
    let user = null;
    let book = null;

    if (orderData.user) {
      const userSnap = await getDoc(orderData.user);
      if (userSnap.exists()) user = { id: userSnap.id, ...userSnap.data() };
    }
    if (orderData.book) {
      const bookSnap = await getDoc(orderData.book);
      if (bookSnap.exists()) book = { id: bookSnap.id, ...bookSnap.data() };
    }
    orders.push({ id: orderDoc.id, ...orderData, user, book });
  }
  return orders;
};

export const addOrder = async (orderData) => {
  const userIdRef = doc(db, "users", orderData.userId);
  const bookIdRef = doc(db, "books", orderData.bookId);

  const newOrderRef = doc(ordersCollectionRef);
  await setDoc(newOrderRef, {
    user: userIdRef,
    book: bookIdRef,
    orderType: orderData.orderType,
    status: orderData.status || 'pending',
    orderDate: new Date(),
    amountPaid: orderData.amountPaid || 0,
    dueDate: orderData.dueDate || null,
  });
  return { id: newOrderRef.id, ...orderData };
};

export const updateOrderStatus = async (orderId, status, adminId, userId, bookId, notes = null) => {
  const orderRef = doc(db, "orders", orderId);
  const orderDocSnap = await getDoc(orderRef);
  if (!orderDocSnap.exists()) {
    throw new Error("Order not found.");
  }
  const orderData = orderDocSnap.data();

  let updateFields = {
    status,
    acceptanceDate: new Date(),
    notes,
  };
  if (status === 'accepted') {
    updateFields.acceptedBy = doc(db, `users/${adminId}`);
  }

  await updateDoc(orderRef, updateFields);

  if (status === 'accepted') {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.data();

    const bookRef = doc(db, "books", bookId);

    const existingBorrowedEntry = (userData.borrowedBooks || []).find(item =>
      item.book.id === bookId && (!item.returnDate || item.returnDate === null)
    );
    
    if (!existingBorrowedEntry) {
      const borrowedBookEntry = {
        book: bookRef,
        borrowDate: orderData.orderDate,
        dueDate: orderData.dueDate || null,
        readingProgress: 0,
        lastReadPage: 0,
      };
      await updateDoc(userDocRef, {
        borrowedBooks: arrayUnion(borrowedBookEntry)
      });
      console.log(`Firestore: Book ${bookId} added to user ${userId}'s borrowedBooks.`);
    } else {
      console.log(`Firestore: Book ${bookId} already in user ${userId}'s borrowedBooks, skipping addition.`);
    }
  }
};


// --- EXPORTED: borrowBook ---
export const borrowBook = async (userId, bookId, daysToBorrow) => {
  const userDocRef = doc(db, "users", userId);
  const bookDocRef = doc(db, "books", bookId);

  await runTransaction(db, async (transaction) => {
    const bookDoc = await transaction.get(bookDocRef);
    const userDoc = await transaction.get(userDocRef);

    if (!bookDoc.exists() || !bookDoc.data().isAvailable) {
      throw new Error("Book is not available for borrowing.");
    }
    if (!userDoc.exists()) {
      throw new Error("User profile not found.");
    }

    const userData = userDoc.data();
    const borrowedBooks = userData.borrowedBooks || [];
    const existingBorrowedEntry = borrowedBooks.find(
      item => item.book && item.book.id === bookId && (!item.returnDate || item.returnDate === null)
    );
    if (existingBorrowedEntry) {
      throw new Error("You have already borrowed this book.");
    }

    transaction.update(bookDocRef, { isAvailable: false });
    const newBorrowedBookEntry = {
      book: bookDocRef,
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + daysToBorrow * 24 * 60 * 60 * 1000),
      readingProgress: 0,
      lastReadPage: 0,
    };
    transaction.update(userDocRef, {
      borrowedBooks: arrayUnion(newBorrowedBookEntry)
    });
    console.log(`Firestore: Book ${bookId} borrowed by user ${userId} for ${daysToBorrow} days.`);
  });
};


// --- EXPORTED: markBookAsReturned ---

export const markBookAsReturned = async (userId, bookId) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User not found in Firestore");
  }

  const userData = userSnap.data();
  const borrowedBooks = userData.borrowedBooks || [];

  // Update the borrowedBooks array
  const updatedBooks = borrowedBooks.map(book => {
    if (book.book.id === bookId && !book.returnDate) {
      return { ...book, returnDate: new Date() }; // Mark returned
    }
    return book;
  });

  // Update user document
  await updateDoc(userRef, {
    borrowedBooks: updatedBooks
  });

  // ✅ Also update the book document to make it available again
  const bookRef = doc(db, "books", bookId);
  await updateDoc(bookRef, { isAvailable: true });
};
