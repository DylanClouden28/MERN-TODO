import React, {useState, useEffect} from "react";

const API_BASE= 'http://localhost:4001/todo';

function TodoItem(props){

    const {name, id, setItems, GetTodos} = props

    const [input, setInput] = useState(name);

    const handleChange = (e) => {
      setInput(e.target.value);
    }

    useEffect(() => {updateItem();}, [input]);

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
      await GetTodos()
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
     <div className="todo">
        <input className="text" type='text' value={input} onChange={handleChange}></input>
        <div className="delete-todo" onClick={() => deleteTodo(id)}><span >X</span></div>
      </div>
    )
}

export default TodoItem;