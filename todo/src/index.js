import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import firebase from 'firebase/compat/app';
import fbConfig from "./fbconfig";


window.addEventListener('unhandledrejection', event => {
  console.error(`Unhandled promise rejection: ${event.reason}`);
});
firebase.initializeApp(fbConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {firebase &&
    (<App firebase={firebase}/>)}
  </React.StrictMode>
);