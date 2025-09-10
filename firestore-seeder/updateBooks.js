// firestore-seeder/updateBooks.js - Updated to set isAvailable and ensure lowercase fields

require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const booksCollectionRef = db.collection('books');

async function updateBooks() {
    console.log("Starting Firestore book update script...");
    let booksProcessed = 0;
    let booksUpdated = 0;
    let booksSkipped = 0;

    try {
        const snapshot = await booksCollectionRef.get();

        if (snapshot.empty) {
            console.log("No books found in the 'books' collection. Please seed books first.");
            return;
        }

        const batch = db.batch(); // Use a batch for efficient writes

        snapshot.docs.forEach(doc => {
            const bookData = doc.data();
            const bookRef = doc.ref;
            const updateFields = {};
            let needsUpdate = false;

            // Ensure lowercase fields for search
            if (bookData.title && bookData.title.toLowerCase() !== bookData.title_lower) {
                updateFields.title_lower = bookData.title.toLowerCase();
                needsUpdate = true;
            }
            if (bookData.author && bookData.author.toLowerCase() !== bookData.author_lower) {
                updateFields.author_lower = bookData.author.toLowerCase();
                needsUpdate = true;
            }
            if (bookData.genre && bookData.genre.toLowerCase() !== bookData.genre_lower) {
                updateFields.genre_lower = bookData.genre.toLowerCase();
                needsUpdate = true;
            }

            // --- CRITICAL FIX: Ensure isAvailable is set to true ---
            // Check if isAvailable is missing, false, null, or not explicitly true
            if (bookData.isAvailable !== true) {
                updateFields.isAvailable = true;
                needsUpdate = true;
            }
            // --- END CRITICAL FIX ---

            if (needsUpdate) {
                batch.update(bookRef, updateFields);
                console.log(`Queued update for book ID ${doc.id}:`, updateFields);
                booksUpdated++;
            } else {
                console.log(`Skipping book ID ${doc.id}: Data is up-to-date.`);
                booksSkipped++;
            }
        });

        if (booksUpdated > 0) {
            await batch.commit();
            console.log(`Successfully updated availability for ${booksUpdated} books.`);
        } else {
            console.log("No book documents required updates.");
        }

    } catch (error) {
        console.error("Error during Firestore book update:", error);
    } finally {
        console.log(`--- Script finished ---`);
        console.log(`Books processed: ${booksUpdated + booksSkipped}`);
        // Exit the process
        process.exit(0);
    }
}

// Execute the update function
updateBooks();