// firestore-seeder/updateBookAvailability.js

require('dotenv').config(); // Load environment variables from .env
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Ensure serviceAccountKey.json is in the same directory and .env is set correctly
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const booksCollectionRef = db.collection('books');

async function updateBooksForAvailability() {
    console.log("Starting Firestore book update script for availability...");
    let booksUpdated = 0;
    let booksSkipped = 0;

    try {
        // Fetch all documents from the 'books' collection
        const snapshot = await booksCollectionRef.get();

        if (snapshot.empty) {
            console.log("No books found in the 'books' collection. Please seed books first.");
            return;
        }

        // Use a batched write for efficiency
        const batch = db.batch();

        snapshot.docs.forEach(doc => {
            const bookData = doc.data();
            const bookRef = doc.ref; // Reference to the document

            // Check if 'isAvailable' field needs to be added or updated
            // We only add/update if it's missing or not 'true'
            if (bookData.isAvailable === undefined || bookData.isAvailable === null || bookData.isAvailable === false) {
                // Add or update 'isAvailable' field to true
                batch.update(bookRef, { isAvailable: true });
                console.log(`Queued update for book ID ${doc.id}: setting isAvailable to true.`);
                booksUpdated++;
            } else {
                // If isAvailable is already true or some other value not requiring change
                console.log(`Skipping book ID ${doc.id}: isAvailable is already set correctly.`);
                booksSkipped++;
            }
        });

        // Commit the batch write
        if (booksUpdated > 0) {
            await batch.commit();
            console.log(`Successfully updated availability for ${booksAdded} books.`);
        } else {
            console.log("No book documents required availability updates.");
        }

    } catch (error) {
        console.error("Error during Firestore book availability update:", error);
    } finally {
        console.log(`--- Script finished ---`);
        console.log(`Books updated: ${booksUpdated}`);
        console.log(`Books skipped (already correct): ${booksSkipped}`);
        // Exit the process
        process.exit(0);
    }
}

// Execute the update function
updateBooksForAvailability();