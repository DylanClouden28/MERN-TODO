import { useEffect, useState } from "react";

import ProtectedRoute from "./ProtectedRoute"
import Todo from "./pages/Todo"

import FirebaseAuth from "./FirebaseAuth";
import { Navigate, Routes, Route } from "react-router-dom";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const API_BASE= 'http://localhost:4001/todo';

function App(){

    const [items, setItems] = useState([]);

    // Add input state, we will store the user's input in this state
    const [input, setInput] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    const firebaseConfig = {

      apiKey: "AIzaSyA1AvTQEUSEfHtFjJyHYmHFuVEYQLrWg0I",
    
      authDomain: "mern-todo-154d6.firebaseapp.com",
    
      projectId: "mern-todo-154d6",
    
      storageBucket: "mern-todo-154d6.appspot.com",
    
      messagingSenderId: "1076173669809",
    
      appId: "1:1076173669809:web:a404ce4105ac8e64176990",
    
      measurementId: "G-1X7R5S7PYF"
    
    };
    
    firebase.initializeApp(firebaseConfig);

    const uiConfig = {
      signInSuccessUrl: 'todo',
      signInOptions: [
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          defaultCountry: 'US',
          recaptchaParameters: {
            type: 'image', // 'audio'
            size: 'invisible', // 'invisible' or 'compact'
            badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
          },
        }
      ],
    };
    
    const [user, setUser] = useState(null);

    useEffect(() => {
      const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
        setUser(user); // Set the user object
      });
      return () => unregisterAuthObserver(); // Cleanup the observer on unmount
    }, []);

    return (
      <Routes>
        <Route path="/auth" element={<FirebaseAuth uiConfig={uiConfig}/> }/>

        <Route path="/todo" element={
          <ProtectedRoute user={user}>
            <Todo firebase={firebase} user={user}/>
          </ProtectedRoute>} 
        />
      </Routes> 
    );
}

export default App;