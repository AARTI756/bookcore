# 📚 Bookcore

*A Cloud-Based Book Borrowing and Management System*

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react)
![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?logo=firebase)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38B2AC?logo=tailwind-css)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)
![Status](https://img.shields.io/badge/Status-Active-blue)

---

## 🧠 Overview

**Bookcore** is a **cloud-based book borrowing and management platform** that transforms traditional library systems into efficient, paperless digital environments.
Developed using **React.js**, **Firebase**, and **TailwindCSS**, it provides real-time synchronization, secure role-based access, and insightful analytics for both users and administrators.

---

## 🚀 Features

* 🔐 **Secure Authentication** using Firebase Auth (User & Admin roles)
* 🔄 **Real-Time Updates** for borrow/return transactions
* 📊 **Admin Analytics Dashboard** with visual charts
* ☁️ **Serverless Architecture** powered by Firebase
* 📱 **Fully Responsive UI** built with TailwindCSS
* 🔍 **Smart Search & Filter** for quick book discovery
* ⚡ **Continuous Deployment** with Vercel hosting

---

## 🧩 Tech Stack

| Layer              | Technology                        |
| ------------------ | --------------------------------- |
| **Frontend**       | React.js (v18)                    |
| **Styling**        | TailwindCSS                       |
| **Backend**        | Firebase Firestore (NoSQL)        |
| **Authentication** | Firebase Auth                     |
| **Storage**        | Firebase Cloud Storage            |
| **Hosting**        | Vercel                            |
| **Testing Tools**  | Jest, Lighthouse, Chrome DevTools |

---

## ⚙️ Installation & Setup

Clone the project and install dependencies:

```bash
git clone https://github.com/AARTI756/bookcore
cd bookcore
npm install
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

### 🔧 Firebase Configuration

1. Create a Firebase project and enable:

   * Firestore Database
   * Authentication (Email/Password)
   * Storage
2. Replace your Firebase config inside `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 🔒 Security

* Firebase Auth tokens for session management
* Firestore Security Rules for access control
* HTTPS encryption
* Role-based permissions for admin and users

---

## 👥 Roles & Permissions

### **1. Admin**

The admin has full control over the system and can manage both books and users. Key functionalities include:

* 📚 **Book Management**

  * Add new books to the library
  * Edit book details (title, author, genre, availability)
  * Delete books from the system

* 🧑‍💻 **User Management**

  * View all registered users
  * Manage user roles and permissions

* 🔄 **Transaction Oversight**

  * Monitor all borrow and return transactions

* 📊 **Analytics & Reports**

  * Access dashboard with visual charts of library usage, popular books, and active users

---

### **2. Student / User**

The student or user can interact with the system to borrow and return books. Key functionalities include:

* 🔍 **Search & Discover**

  * Search for books by title, author, or genre
  * Filter books by availability

* 📖 **Borrow & Return**

  * Request to borrow available books
  * Return borrowed books


## 📸 Screenshots

### 🔑 Login

![Login](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-3.png)

### 🧾 Register

![Register](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-4.png)

### 🏠 Home

![Home](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-1.png)
![Home Alt](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-2.png)
![Home Extra](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-5.png)
![Home Layout](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-6.png)

### 📚 Book List

![Book List](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-15.png)

### 📖 Borrow Book

![Borrow Book](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-14.png)
![Borrow Book 2](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-17.png)
![Borrow Book 3](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-18.png)

### 🔁 Return Book

![Return Book](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-9.png)

### 🧮 Admin Dashboard

![Admin Dashboard](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image.png)
![Admin Dashboard Alt](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-16.png)

### 👤 User Profile

![User Profile](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-7.png)
![User Profile 2](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-8.png)
![User Profile 3](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-10.png)
![User Profile 4](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-11.png)
![User Profile 5](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-12.png)
![User Profile 6](https://raw.githubusercontent.com/AARTI756/bookcore/master/public/assets/screenshots/image-13.png)

---


## 🎥 Project Demo
[Watch the demo video](https://github.com/AARTI756/bookcore/blob/master/bookcore.mp4)

---

## 📈 Future Enhancements

* 🤖 AI-based Book Recommendations
* 🧾 QR/Barcode Borrowing System
* 🌍 Offline-ready PWA
* 🔗 Academic API Integrations
* 🌐 Multilingual & Accessible UI
* 🪙 Blockchain-enabled Borrow History

## 👩‍💻 Author

**Aarti Sakpal**  
🎓 Computer Engineering Student  
🏫 Vidyalankar Institute of Technology, Mumbai  
📧 [aarti.sakpal@vit.edu.in](mailto:aarti.sakpal@vit.edu.in)  

---

© 2025 Aarti Sakpal  
Developed as part of the **Cloud Computing and Web Technologies Project** at **VIT Mumbai**.
