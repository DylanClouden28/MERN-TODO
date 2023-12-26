import { useEffect, useState } from "react";

import TodoItem from "./TodoItem";

import FirebaseAuth from "./FirebaseAuth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const API_BASE= 'http://localhost:4001/todo';

function Auth(){

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

export default Auth;