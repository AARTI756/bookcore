import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Basic reset styles
import './App.css';   // Global app styles and variables
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);