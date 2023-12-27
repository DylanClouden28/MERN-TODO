import React, {useState, useEffect, useRef} from "react";
import { getAuth, signOut } from 'firebase/auth';


const API_BASE= 'http://localhost:4001/todo';

function TodoItem(props){

    const {name, id, setItems, firebase} = props

    const [input, setInput] = useState(name);

    const firstRenderRef = useRef(true);

    const debounceTimeoutRef = useRef(null);

    const auth = getAuth();

    const handleChange = (e) => {
      setInput(e.target.value);
    }

    useEffect(() => {
      if (firstRenderRef.current) {
        firstRenderRef.current = false;
        return;
      }

      if (input !== name) {

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        updateItem();
      }, 500); 
    }
    }, [input]);


    const updateItem = async() => {

      const idToken = await auth.currentUser.getIdToken();

      const data = await fetch(API_BASE + "/update/" + id, {
       method: "PUT",
       headers: {
         "content-type" : "application/json",
         "Authorization": `${idToken}`
       },
       body: JSON.stringify({
         name: input,
           })
      }).then(res => res.json()) 
     }

    const deleteTodo = async(id) => {
      try{
          const idToken = await auth.currentUser.getIdToken();

          const response = await fetch(API_BASE + "/delete/" + id, {
              method: "DELETE",
              headers: {
                "content-type" : "application/json",
                "Authorization": `${idToken}`
              },
            });
          if(!response.ok){
              throw new Error("Faild to delete a task")
          } 
          const data = await response.json()
          //GetTodos()
          setItems(items=> items.filter(item=> item._id !== data._id))
      }catch (error) {
          console.error("Error updating task status:", error);
        }
    }

    return(
      <div className="todo flex justify-center items-center">
      <input 
          className="input w-full max-w-xs input-bordered mx-2"
          type='text'
          value={input}
          onChange={handleChange}
      />
      <button 
          className="btn btn-error"
          onClick={() => deleteTodo(id)}
      >
          <span>X</span>
      </button>
  </div>
    )
}

export default TodoItem;