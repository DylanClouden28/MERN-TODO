import { useContext, useEffect, useState } from "react";

import TodoItem from "../TodoItem";

import { getAuth, signOut } from 'firebase/auth';
import 'firebase/compat/auth';
import { Context } from "../context/AuthContext";

const API_BASE= 'http://192.168.1.63:4001/todo';

function Todo({firebase, isSignedIn}){

    const [items, setItems] = useState([]);

    // Add input state, we will store the user's input in this state
    const [input, setInput] = useState("");
    const {user} = useContext(Context);
    const auth = getAuth();
    
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
                    "Authorization": `Bearer ${idToken}` // Ensure you use 'Bearer' in the Authorization header
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
            "Authorization": `Bearer ${idToken}`
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
      <button onClick={() => signOut(auth).catch((error) => {console.log(error)})} className="btn btn-primary">
        Sign out
      </button>
  </div>
    );
}

export default Todo;