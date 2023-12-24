import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


window.addEventListener('unhandledrejection', event => {
  console.error(`Unhandled promise rejection: ${event.reason}`);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);