import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "./context/AuthContext";

// const ProtectedRoute = ({ user, children }) => {
//     if (!!user) {
//       return <Navigate to="/auth" replace />;
//     }
  
//     return children;
// };

export function ProtectedRoute({children}){
  const {user} = useContext(Context);

  if(!user){
    return <Navigate to="/signin" replace />;
  }

  return children;
}