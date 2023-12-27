import { useEffect, useState } from "react";

import {ProtectedRoute} from "./ProtectedRoute"
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Todo from "./pages/Todo"
import Auth from "./pages/Auth"

import fbConfig from "./fbconfig";
import fbuiConfig from "./fbuiConfig";
import FirebaseAuth from "./FirebaseAuth";
import { Navigate, Routes, Route } from "react-router-dom";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { AuthContext } from "./context/AuthContext";

const API_BASE= 'http://localhost:4001/todo';

function App(firebase){
    const router = createBrowserRouter([
      {
        path:"/signin", element:<Auth uiConfig={fbuiConfig}/>
      },
      {
        path:"/todo", element:<ProtectedRoute><Todo firebase={firebase}/></ProtectedRoute>
      }
    ])

    return (
      <AuthContext>
        <RouterProvider router={router}>

        </RouterProvider> 
      </AuthContext>
    );
}

export default App;