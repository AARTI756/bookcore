// src/context/AuthContext.js - Firebase Authentication and User Data Integration

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    GoogleAuthProvider, 
    signInWithPopup,
    sendPasswordResetEmail 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // For Firestore operations
import { auth, db } from '../firebaseConfig'; // Import auth and db instances

const AuthContext = createContext(null); // Context for authentication state

export const AuthProvider = ({ children }) => {
    const [firebaseUser, setFirebaseUser] = useState(null); // Raw user object from Firebase Auth
    const [appUser, setAppUser] = useState(null); // Custom user object with roles from Firestore
    const [loading, setLoading] = useState(true); // Initial loading state for auth check

    // Effect to listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                // User is signed in with Firebase Auth
                const userDocRef = doc(db, "users", fbUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                let customUserData;
                if (userDocSnap.exists()) {
                    customUserData = userDocSnap.data();
                    console.log("AuthContext: Custom user data from Firestore:", customUserData);
                } else {
                    // Handle new registrations or first-time Google logins
                    customUserData = {
                        uid: fbUser.uid,
                        email: fbUser.email,
                        name: fbUser.displayName || fbUser.email.split('@')[0], // Use display name or derive from email
                        picture: fbUser.photoURL || `https://ui-avatars.com/api/?name=${fbUser.displayName || fbUser.email.split('@')[0]}&background=random`,
                        role: 'student', // Default new users to 'student' role
                        createdAt: new Date(),
                    };
                    // Save default user data to Firestore
                    await setDoc(userDocRef, customUserData);
                    console.log("AuthContext: New user data saved to Firestore:", customUserData);
                }
                // Set both Firebase user object and our app-specific user data
// In src/context/AuthContext.js -> onAuthStateChanged callback

    // ... (logic to fetch customUserData) ...
    setAppUser({ ...customUserData, firebaseUserUid: fbUser.uid });
    setFirebaseUser(fbUser); // <-- Ensure this line is present and correct
    console.log("AuthContext: Firebase user signed in:", fbUser.email);
} else {
    setFirebaseUser(null); // <-- Ensure this is set to null on logout
    setAppUser(null);
    console.log("AuthContext: Firebase user signed out.");
}
setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []); // Empty dependency array: runs once on mount

    // --- Authentication Functions ---
    
    // Register new user (Email/Password)
    const register = useCallback(async (email, password, firstName, lastName, mobile, address) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const fbUser = userCredential.user;

            // Save custom user data to Firestore
            await setDoc(doc(db, "users", fbUser.uid), {
                uid: fbUser.uid,
                email: fbUser.email,
                firstName: firstName,
                lastName: lastName,
                name: `${firstName} ${lastName}`.trim(),
                picture: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
                mobile: mobile,
                address: address,
                role: 'student', // Default role
                createdAt: new Date(),
            });
            console.log("AuthContext: User registered and data saved:", fbUser.email);
            return userCredential;
        } catch (error) {
            console.error("AuthContext: Registration error:", error.code, error.message);
            throw error; // Re-throw for UI to handle
        }
    }, []);

    // Login user (Email/Password)
    const login = useCallback(async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("AuthContext: User logged in via email/password:", userCredential.user.email);
            return userCredential;
        } catch (error) {
            console.error("AuthContext: Login error:", error.code, error.message);
            throw error;
        }
    }, []);

    // Login with Google
    const loginWithGoogle = useCallback(async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const fbUser = result.user;
            console.log("AuthContext: User logged in via Google:", fbUser.email);
            // onAuthStateChanged will handle fetching/creating user data in Firestore
            return result;
        } catch (error) {
            console.error("AuthContext: Google login error:", error.code, error.message);
            throw error;
        }
    }, []);

    // Logout user
    const logout = useCallback(async () => {
        try {
            await signOut(auth);
            console.log("AuthContext: User logged out.");
        } catch (error) {
            console.error("AuthContext: Logout error:", error.code, error.message);
            throw error;
        }
    }, []);

    // Forgot Password
    const resetPassword = useCallback(async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            console.log("AuthContext: Password reset email sent to:", email);
            return true;
        } catch (error) {
            console.error("AuthContext: Password reset error:", error.code, error.message);
            throw error;
        }
    }, []);

    // Context value object
    const value = {
        user: appUser, // Our custom user object with role, etc.
        firebaseUser: firebaseUser, // Raw Firebase Auth user object
        loading, // Global auth loading state
        register,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/* Render children only when auth state is known */}
        </AuthContext.Provider>
    );
};

// Custom hook to consume the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};