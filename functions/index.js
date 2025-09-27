import App from "./App.js";

const { setGlobalOptions } = require("firebase-functions/v2/options");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Global options
setGlobalOptions({ maxInstances: 10 });

// Firestore trigger: runs when a new user document is created
exports.createUserMonthlyData = onDocumentCreated("users/{userId}", async (event) => {
  const userId = event.params.userId;

  const monthlyDataRef = admin.firestore()
    .collection("users")
    .doc(userId)
    .collection("monthlyData");

  // Initialize months with 0 books read
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const batch = admin.firestore().batch();

  months.forEach((month) => {
    const docRef = monthlyDataRef.doc(month);
    batch.set(docRef, { booksRead: 0 });
  });

  await batch.commit();
  console.log(`Monthly data initialized for user: ${userId}`);
});
