// firestore-seeder/convertBookAvailability.js

require('dotenv').config(); // Load environment variables
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const booksCollectionRef = db.collection('books');

async function convertBookAvailability() {
    console.log("Starting script to convert 'availability' string to 'isAvailable' boolean...");
    let booksProcessed = 0;
    let booksUpdated = 0;
    let booksSkipped = 0;

    try {
        const snapshot = await booksCollectionRef.get();

        if (snapshot.empty) {
            console.log("No books found in the 'books' collection.");
            return;
        }

        const batch = db.batch(); // Use a batch for efficient writes

        snapshot.docs.forEach(doc => {
            const bookData = doc.data();
            const bookRef = doc.ref;
            let needsUpdate = false;
            const updateFields = {};
            const deleteFields = {};

            // Check for the old 'availability' string field
            if (bookData.availability !== undefined) {
                if (typeof bookData.availability === 'string') {
                    // Convert "Yes" to true, anything else to false
                    updateFields.isAvailable = (bookData.availability.toLowerCase() === 'yes');
                    deleteFields.availability = admin.firestore.FieldValue.delete(); // Mark old field for deletion
                    needsUpdate = true;
                } else if (typeof bookData.availability === 'boolean') {
                    // If it's already a boolean, just ensure it's named 'isAvailable'
                    if (bookData.isAvailable === undefined) {
                        updateFields.isAvailable = bookData.availability;
                        deleteFields.availability = admin.firestore.FieldValue.delete();
                        needsUpdate = true;
                    } else {
                        console.log(`Skipping book ID ${doc.id}: 'availability' is already boolean and 'isAvailable' exists.`);
                        booksSkipped++;
                        return; // Skip this doc if nothing to do
                    }
                }
            } else if (bookData.isAvailable === undefined) {
                // If neither 'availability' nor 'isAvailable' exists, default to true
                updateFields.isAvailable = true;
                needsUpdate = true;
            }

            // If any fields need updating, add to the batch
            if (needsUpdate) {
                // Combine update and delete operations in a single batch.update call
                // This is for Firestore's specific way of handling field deletion
                const finalUpdate = { ...updateFields };
                for (const key in deleteFields) {
                    if (deleteFields[key] === admin.firestore.FieldValue.delete()) {
                        finalUpdate[key] = admin.firestore.FieldValue.delete();
                    }
                }
                batch.update(bookRef, finalUpdate);
                console.log(`Queued update for book ID ${doc.id}. Setting isAvailable to ${updateFields.isAvailable}.`);
                booksUpdated++;
            } else {
                console.log(`Skipping book ID ${doc.id}: No availability conversion needed.`);
                booksSkipped++;
            }
        });

        if (booksUpdated > 0) {
            await batch.commit();
            console.log(`Successfully converted availability for ${booksUpdated} books.`);
        } else {
            console.log("No book documents required availability conversion.");
        }

    } catch (error) {
        console.error("Error during Firestore availability conversion:", error);
    } finally {
        console.log(`--- Script finished ---`);
        console.log(`Books processed: ${booksUpdated + booksSkipped}`);
        console.log(`Books converted: ${booksUpdated}`);
        console.log(`Books skipped: ${booksSkipped}`);
        process.exit(0);
    }
}

// Execute the update function
convertBookAvailability();