import React, {useState, useEffect, useRef} from "react";

const API_BASE= 'http://localhost:4001/todo';

function TodoItem(props){

    const {name, id, setItems} = props

    const [input, setInput] = useState(name);

    const firstRenderRef = useRef(true);

    const debounceTimeoutRef = useRef(null);

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
      const data = await fetch(API_BASE + "/update/" + id, {
       method: "PUT",
       headers: {
         "content-type" : "application/json"
       },
       body: JSON.stringify({
         name: input,
           })
      }).then(res => res.json()) 
     }

    const deleteTodo = async(id) => {
      try{
          const response = await fetch(API_BASE + "/delete/" + id, {
              method: "DELETE",
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
      <div className="todo flex items-center justify-between bg-white p-2 rounded shadow">
      <input 
          className="text-black flex-1 p-2 rounded border-2 border-gray-300 mr-2"
          type='text'
          value={input}
          onChange={handleChange}
      />
      <button 
          className="delete-todo bg-red-500 hover:bg-red-700 text-white p-2 rounded"
          onClick={() => deleteTodo(id)}
      >
          <span>X</span>
      </button>
  </div>
    )
}

export default TodoItem;