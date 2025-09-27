import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const run = async () => {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    for (const userDoc of snapshot.docs) {
      console.log("User:", userDoc.id, userDoc.data());
    }
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    process.exit(0);
  }
};

run();
