import { useEffect, useState } from "react";

import TodoItem from "./TodoItem";

import FirebaseAuth from "./FirebaseAuth";
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
      signInSuccessUrl: '<URL_AFTER_SIGN_IN>',
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
    // Store the target's value into the input state 
  const handleChange = (e) => {
    setInput(e.target.value);
  }

    useEffect(() => {
        GetTodos();
      }, []);

      const GetTodos = async () => {
        console.log("fetching");
    
        // Check if a user is signed in
        const user = firebase.auth().currentUser;
        if (!user) {
            console.error("No user signed in.");
            // Optionally, handle the scenario where there is no user (e.g., redirect to login)
            return;
        }
    
        try {
            const idToken = await user.getIdToken();
    
            const response = await fetch(API_BASE, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `${idToken}` // Ensure you use 'Bearer' in the Authorization header
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            setItems(data);
        } catch (err) {
            console.error("Error fetching todos:", err);
        }
    };

    const addItem = async () => {
      // Check for authenticated user
      const user = firebase.auth().currentUser;
      if (!user) {
        console.error("No user signed in.");
        return;
      }
    
      try {
        const idToken = await user.getIdToken();
        const response = await fetch(API_BASE + "/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${idToken}`
          },
          body: JSON.stringify({ name: input })
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        await GetTodos();
        setInput('');
      } catch (error) {
        console.error('Error adding item:', error);
      }
    };

    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
      const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async user => {
        setIsSignedIn(!!user); // !!user converts the user object to a boolean
        if (user) {
          await GetTodos();
        }
      });
      return () => unregisterAuthObserver(); // Cleanup the observer on unmount
    }, []);


    if (!isSignedIn) {
      // User not signed in, show FirebaseAuth
      return <FirebaseAuth uiConfig={uiConfig} />;
    }


    return (
      <div className="container mx-auto p-4">
      <div className="heading text-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600">TO-DO-APP</h1>
      </div>

      <div className="form flex justify-center gap-2 mb-4">
          <input
              className="input w-full max-w-xs input-bordered"
              type='text'
              value={input}
              onChange={handleChange}
              placeholder="Add a new todo"
          />
          <button
              className="btn btn-primary"
              onClick={()=>addItem()}
          >
              ADD
          </button>
      </div>

      <div className="todolist space-y-2">  
          {items.map((item) => {
              const {_id, name} = item
              return <TodoItem key={item._id} name={name} id={_id} setItems={setItems} firebase={firebase} />   
          })}
      </div>
      <button onClick={() => firebase.auth().signOut()} className="btn btn-primary">
        Sign out
      </button>
  </div>
    );
}

export default App;