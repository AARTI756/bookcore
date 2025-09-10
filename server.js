// bookcore-server/server.js - Firebase Admin SDK Backend

require('dotenv').config(); // MUST BE THE VERY FIRST LINE
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const { OAuth2Client } = require('google-auth-library'); // Still needed for Google login

// --- Initialize Firebase Admin SDK ---
// Path to your downloaded service account key
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get Firestore and Auth instances
const db = admin.firestore();
const authAdmin = admin.auth(); // To manage users from backend

// --- Google OAuth2Client for server-side verification ---
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const oauth2Client = new OAuth2Client(CLIENT_ID);
console.log("BACKEND GOOGLE DEBUG: CLIENT_ID seen by server:", CLIENT_ID); // Keep for debugging


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Firebase Auth Middleware (Replaces old JWT middleware) ---
const verifyFirebaseToken = async (req, res, next) => {
    const idToken = req.header('x-auth-token'); // Frontend will send Firebase ID token here

    if (!idToken) {
        console.log("AUTH MIDDLEWARE DEBUG: No Firebase ID token received.");
        return res.status(401).json({ msg: 'No authentication token provided.' });
    }

    try {
        const decodedToken = await authAdmin.verifyIdToken(idToken); // Verify with Firebase
        req.user = { // Set user data from Firebase decoded token
            uid: decodedToken.uid,
            email: decodedToken.email,
            // Fetch custom role from Firestore
            role: (await db.collection('users').doc(decodedToken.uid).get()).data().role || 'student'
        };
        console.log("AUTH MIDDLEWARE DEBUG: Firebase ID Token verified. User UID:", req.user.uid, "Role:", req.user.role);
        next();
    } catch (error) {
        console.error("AUTH MIDDLEWARE DEBUG ERROR: Firebase ID Token verification failed:", error);
        res.status(401).json({ msg: 'Invalid or expired authentication token.' });
    }
};

// Admin specific middleware (reused, but relies on verifyFirebaseToken first)
const checkAdminRole = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        console.log("AUTH MIDDLEWARE DEBUG: Admin access denied. User role:", req.user ? req.user.role : 'none');
        res.status(403).json({ msg: 'Admin access required.' });
    }
};


// ==================================================================
// --- API ROUTES ---
// ==================================================================

// Public Root Route
app.get('/', (req, res) => {
    res.send('BookCore API is running (Firebase Backend)!');
});

// --- User Authentication Routes (Using Firebase Auth) ---

// LOGIN/REGISTER via Email/Password (NO LONGER NEEDED AS FRONTEND HANDLES DIRECTLY WITH FIREBASE)
// app.post('/api/register', ...)
// app.post('/api/login', ...)


// GOOGLE LOGIN (Server-Side Verification) - Public endpoint, token verified here
app.post('/api/auth/google', async (req, res) => {
    console.log('--- GOOGLE LOGIN REQUEST RECEIVED ON BACKEND ---');
    try {
        const { id_token } = req.body; // Google ID token from frontend
        
        // 1. Verify the Google ID Token with Google's API
        const ticket = await oauth2Client.verifyIdToken({
            idToken: id_token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        
        const googleEmail = payload['email'];
        const googleName = payload['name'];
        const googlePicture = payload['picture'];
        const googleFirstName = payload['given_name'];
        const googleLastName = payload['family_name'];
        const googleUid = payload['sub']; // Google's unique ID for the user

        // 2. Authenticate with Firebase using the Google ID Token
        const firebaseToken = await authAdmin.createCustomToken(googleUid); // Create a custom Firebase token for this Google user
        
        // 3. Check/Create User data in Firestore (for custom fields like role)
        const userDocRef = db.collection('users').doc(googleUid);
        const userDocSnap = await userDocRef.get();

        let userResponseData;
        if (!userDocSnap.exists) {
            // New Google user, create Firestore document
            userResponseData = {
                uid: googleUid,
                email: googleEmail,
                firstName: googleFirstName || googleName,
                lastName: googleLastName || '',
                name: googleName || googleEmail.split('@')[0],
                picture: googlePicture,
                role: 'student', // Default role for new Google users
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await userDocRef.set(userResponseData);
            console.log("New user data saved to Firestore for Google login:", googleEmail);
        } else {
            userResponseData = userDocSnap.data();
            console.log("Existing user logged in via Google:", googleEmail);
        }

        // Return the custom Firebase token and user data for frontend to sign in with Firebase
        res.status(200).json({ firebaseToken, user: userResponseData });

    } catch (err) {
        console.error("!!! SERVER ERROR DURING GOOGLE LOGIN VERIFICATION:", err);
        if (err.message.includes('Invalid ID token') || err.message.includes('audience') || err.message.includes('token has expired')) {
            return res.status(400).json({ msg: 'Google ID token verification failed: ' + err.message });
        }
        res.status(500).json({ msg: 'Google login failed on server.' });
    }
});


// GET LOGGED-IN USER'S PROFILE AND BORROWED BOOKS (Protected by Firebase Auth)
app.get('/api/me', verifyFirebaseToken, async (req, res) => {
    try {
        // req.user.uid is set by verifyFirebaseToken middleware
        const userDoc = await db.collection('users').doc(req.user.uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ msg: 'User profile not found in Firestore.' });
        }
        const userData = userDoc.data();
        
        // Populate borrowedBooks (manual population for Firestore)
        if (userData.borrowedBooks && userData.borrowedBooks.length > 0) {
            const populatedBorrowedBooks = await Promise.all(
                userData.borrowedBooks.map(async (item) => {
                    const bookDoc = await db.collection('books').doc(item.book.id).get();
                    return {
                        ...item,
                        book: bookDoc.exists ? { id: bookDoc.id, ...bookDoc.data() } : null // Embed book data
                    };
                })
            );
            userData.borrowedBooks = populatedBorrowedBooks.filter(item => item.book !== null); // Remove any nulls
        }

        res.json(userData);

    } catch (err) {
        console.error("Error fetching user profile:", err.message);
        res.status(500).send('Server Error');
    }
});

// --- User Management Endpoints (Admin Only) ---

// GET ALL USERS (Protected by Firebase Auth & Admin Role)
app.get('/api/users', verifyFirebaseToken, checkAdminRole, async (req, res) => {
    try {
        const listUsersResult = await authAdmin.listUsers(1000); // Get users from Firebase Auth
        const authUsers = listUsersResult.users.map(userRecord => ({
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            photoURL: userRecord.photoURL,
            emailVerified: userRecord.emailVerified,
            createdAt: userRecord.metadata.creationTime,
        }));

        // Fetch custom roles from Firestore for all users
        const firestoreUserDocs = await db.collection('users').get();
        const firestoreUsersMap = new Map();
        firestoreUserDocs.forEach(doc => {
            firestoreUsersMap.set(doc.id, doc.data());
        });

        const combinedUsers = authUsers.map(authUser => {
            const firestoreData = firestoreUsersMap.get(authUser.uid);
            return {
                ...authUser,
                role: firestoreData?.role || 'student', // Default to student if no role in Firestore
                firstName: firestoreData?.firstName || authUser.displayName,
                lastName: firestoreData?.lastName || '',
                address: firestoreData?.address || '',
                mobile: firestoreData?.mobile || '',
                // Add dashboard stats if needed
                totalBooksRead: firestoreData?.totalBooksRead || 0,
                totalHoursRead: firestoreData?.totalHoursRead || 0,
                genresExplored: firestoreData?.genresExplored || [],
            };
        });

        res.json(combinedUsers);
    } catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE A USER (Admin Only)
app.delete('/api/users/:uid', verifyFirebaseToken, checkAdminRole, async (req, res) => {
    try {
        const { uid } = req.params; // User UID from URL
        
        // Prevent admin from deleting themselves
        if (req.user && req.user.uid === uid) {
            return res.status(403).json({ msg: 'Cannot delete your own admin account.' });
        }

        // Delete from Firebase Auth
        await authAdmin.deleteUser(uid);
        // Delete from Firestore
        await db.collection('users').doc(uid).delete();

        res.json({ msg: 'User deleted successfully!' });
    } catch (err) {
        console.error("Error deleting user:", err.message);
        res.status(500).send('Server Error');
    }
});


// --- Order Management Endpoints ---

// PLACE A NEW ORDER/BORROW REQUEST (User)
app.post('/api/orders', verifyFirebaseToken, async (req, res) => {
    try {
        const { bookId, orderType, amountPaid, dueDate } = req.body;
        const userId = req.user.uid; // User UID from Firebase token

        const bookDoc = await db.collection('books').doc(bookId).get();
        if (!bookDoc.exists) {
            return res.status(404).json({ msg: 'Book not found.' });
        }
        const book = bookDoc.data();

        // Check if user already has this book borrowed/purchased (simple check)
        const userDocRef = db.collection('users').doc(userId);
        const userDocSnap = await userDocRef.get();
        const userData = userDocSnap.data();

        const existingBorrowedBook = userData.borrowedBooks.find(item => item.book.id === bookId && !item.returnDate);
        if (existingBorrowedBook) {
            return res.status(400).json({ msg: 'You already have this book borrowed or purchased.' });
        }

        if (orderType === 'purchase' && book.isExclusive && (!amountPaid || amountPaid < book.price)) {
            return res.status(400).json({ msg: 'Payment required for exclusive books.' });
        }
        
        let status = 'pending';
        let actualAmountPaid = amountPaid;
        let actualDueDate = dueDate;

        if (orderType === 'borrow') {
            if (book.isExclusive) {
                return res.status(400).json({ msg: 'Exclusive books must be purchased, not borrowed.' });
            }
            status = 'accepted';
            actualDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
        } else if (orderType === 'purchase') {
            if (!book.isExclusive) {
                status = 'accepted';
                actualAmountPaid = 0;
            } else {
                status = 'pending';
            }
        } else {
            return res.status(400).json({ msg: 'Invalid order type.' });
        }

        const newOrderRef = db.collection('orders').doc(); // Auto-generate ID
        const orderData = {
            id: newOrderRef.id,
            user: db.doc(`users/${userId}`), // Reference to user document
            book: db.doc(`books/${bookId}`), // Reference to book document
            orderType,
            status,
            orderDate: admin.firestore.FieldValue.serverTimestamp(),
            amountPaid: actualAmountPaid || 0,
            dueDate: actualDueDate || null,
            acceptedBy: status === 'accepted' ? db.doc(`users/${userId}`) : null, // Admin who accepted (if auto-accepted)
            acceptanceDate: status === 'accepted' ? admin.firestore.FieldValue.serverTimestamp() : null,
            notes: null,
        };
        await newOrderRef.set(orderData);

        // Update user's orders array and borrowedBooks array (if accepted)
        if (status === 'accepted') {
            const borrowedBookEntry = {
                book: db.doc(`books/${bookId}`), // Store as DocumentReference
                borrowDate: orderData.orderDate,
                dueDate: orderData.dueDate,
                readingProgress: 0,
                lastReadPage: 0,
            };
            await userDocRef.update({
                borrowedBooks: admin.firestore.FieldValue.arrayUnion(borrowedBookEntry),
                orders: admin.firestore.FieldValue.arrayUnion(newOrderRef)
            });
        } else {
            await userDocRef.update({
                orders: admin.firestore.FieldValue.arrayUnion(newOrderRef)
            });
        }
        
        res.status(201).json({ msg: 'Order placed successfully!', order: { id: newOrderRef.id, ...orderData } });

    } catch (err) {
        console.error("Error placing order:", err.message);
        res.status(500).send('Server Error');
    }
});

// GET ALL ORDERS (Admin Only)
app.get('/api/orders', verifyFirebaseToken, checkAdminRole, async (req, res) => {
    try {
        const ordersSnapshot = await db.collection('orders').get();
        const orders = [];
        for (const doc of ordersSnapshot.docs) {
            const orderData = doc.data();
            // Manually populate user and book details
            const userDoc = await orderData.user.get();
            const bookDoc = await orderData.book.get();
            orders.push({
                id: doc.id,
                ...orderData,
                user: userDoc.exists ? { id: userDoc.id, ...userDoc.data() } : null,
                book: bookDoc.exists ? { id: bookDoc.id, ...bookDoc.data() } : null,
            });
        }
        res.json(orders);
    } catch (err) {
        console.error("Error fetching orders:", err.message);
        res.status(500).send('Server Error');
    }
});

// ACCEPT A PENDING ORDER (Admin Only)
app.put('/api/orders/:id/accept', verifyFirebaseToken, checkAdminRole, async (req, res) => {
    try {
        const orderId = req.params.id;
        const adminUid = req.user.uid;

        const orderRef = db.collection('orders').doc(orderId);
        const orderDoc = await orderRef.get();
        if (!orderDoc.exists) {
            return res.status(404).json({ msg: 'Order not found.' });
        }
        const order = orderDoc.data();

        if (order.status !== 'pending') {
            return res.status(400).json({ msg: 'Order is not pending and cannot be accepted.' });
        }

        await orderRef.update({
            status: 'accepted',
            acceptedBy: db.doc(`users/${adminUid}`), // Store admin as a reference
            acceptanceDate: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Add book to user's borrowedBooks if not already there
        const userDocRef = db.collection('users').doc(order.user.id);
        const userDocSnap = await userDocRef.get();
        const userData = userDocSnap.data();

        const existingBookEntry = userData.borrowedBooks.find(item => item.book.id === order.book.id && !item.returnDate);
        
        if (!existingBookEntry) {
            const bookEntry = {
                book: order.book, // This is already a DocumentReference
                borrowDate: order.orderDate,
                dueDate: order.orderType === 'borrow' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null,
                readingProgress: 0,
                lastReadPage: 0,
            };
            await userDocRef.update({
                borrowedBooks: admin.firestore.FieldValue.arrayUnion(bookEntry)
            });
        } else {
            console.log(`Book ${order.book.id} already in user ${order.user.id}'s borrowed list.`);
        }

        res.json({ msg: 'Order accepted successfully!', orderId: orderId });

    } catch (err) {
        console.error("Error accepting order:", err.message);
        res.status(500).send('Server Error');
    }
});

// REJECT A PENDING ORDER (Admin Only)
app.put('/api/orders/:id/reject', verifyFirebaseToken, checkAdminRole, async (req, res) => {
    try {
        const orderId = req.params.id;
        const { notes } = req.body;

        const orderRef = db.collection('orders').doc(orderId);
        const orderDoc = await orderRef.get();
        if (!orderDoc.exists) {
            return res.status(404).json({ msg: 'Order not found.' });
        }
        const order = orderDoc.data();

        if (order.status !== 'pending') {
            return res.status(400).json({ msg: 'Order is not pending and cannot be rejected.' });
        }

        await orderRef.update({
            status: 'rejected',
            notes: notes || 'Rejected by admin.',
            acceptanceDate: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.json({ msg: 'Order rejected successfully!', orderId: orderId });

    } catch (err) {
        console.error("Error rejecting order:", err.message);
        res.status(500).send('Server Error');
    }
});


// --- Book Management Routes ---

// GET ALL BOOKS (Publicly accessible)
app.get('/api/books', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 0;
        let query = db.collection('books');
        if (limit > 0) {
            query = query.limit(limit);
        }
        const snapshot = await query.get();
        const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(books);
    } catch (err) {
        console.error("Error fetching books:", err.message);
        res.status(500).send('Server Error');
    }
});

// GET A SINGLE BOOK BY ID (Publicly accessible)
app.get('/api/books/:id', async (req, res) => {
    try {
        const bookDoc = await db.collection('books').doc(req.params.id).get();
        if (!bookDoc.exists) {
            return res.status(404).json({ msg: 'Book not found' });
        }
        res.json({ id: bookDoc.id, ...bookDoc.data() });
    } catch (err) {
        console.error("Error fetching single book:", err.message);
        res.status(500).send('Server Error');
    }
});

// ADD A NEW BOOK (Admin Only)
app.post('/api/books', verifyFirebaseToken, checkAdminRole, async (req, res) => {
    try {
        const { title, author, genre, description, coverImageUrl, pdfUrl, isExclusive, price, publishedYear } = req.body;
        if (!title || !author || !coverImageUrl || !pdfUrl) {
            return res.status(400).json({ msg: 'Please provide title, author, cover image URL, and PDF URL.' });
        }
        const newBookRef = db.collection('books').doc(); // Auto-generate ID
        const bookData = {
            title, author, genre, description, coverImageUrl, pdfUrl, isExclusive, price, publishedYear,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await newBookRef.set(bookData);
        res.status(201).json({ msg: 'Book added successfully!', book: { id: newBookRef.id, ...bookData } });
    } catch (err) {
        console.error("Error adding book:", err.message);
        res.status(500).send('Server Error');
    }
});

// UPDATE A BOOK (Admin Only)
app.put('/api/books/:id', verifyFirebaseToken, checkAdminRole, async (req, res) => {
    try {
        const { title, author, genre, description, coverImageUrl, pdfUrl, isExclusive, price, publishedYear } = req.body;
        const bookRef = db.collection('books').doc(req.params.id);
        const bookDoc = await bookRef.get();
        if (!bookDoc.exists) {
            return res.status(404).json({ msg: 'Book not found.' });
        }

        const updateData = {
            title, author, genre, description, coverImageUrl, pdfUrl, isExclusive, price, publishedYear,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await bookRef.update(updateData);
        res.json({ msg: 'Book updated successfully!', book: { id: bookRef.id, ...updateData } });
    } catch (err) {
        console.error("Error updating book:", err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE A BOOK (Admin Only)
app.delete('/api/books/:id', verifyFirebaseToken, checkAdminRole, async (req, res) => {
    try {
        const bookRef = db.collection('books').doc(req.params.id);
        await bookRef.delete();
        res.json({ msg: 'Book deleted successfully!' });
    } catch (err) {
        console.error("Error deleting book:", err.message);
        res.status(500).send('Server Error');
    }
});


// --- Start the Server ---
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));