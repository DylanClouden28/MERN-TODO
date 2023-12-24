import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";

const API_BASE= 'http://localhost:4001/todo';

function App(){

    const [items, setItems] = useState([]);

    // Add input state, we will store the user's input in this state
    const [input, setInput] = useState("");

    // Store the target's value into the input state 
  const handleChange = (e) => {
    setInput(e.target.value);
  }

    useEffect(() => {
        GetTodos();
      }, []);

    const GetTodos = () => {
    console.log("fetching")
    fetch(API_BASE)
    .then(res => res.json())
    .then(data => setItems(data))
    .catch(err => console.log(err))
    }

    const addItem = async() => {
      const data = await fetch(API_BASE + "/new", {
       method: "POST",
       headers: {
         "content-type" : "application/json"
       },
       body: JSON.stringify({
         name: input,
           })
      }).then(res => res.json()) 
      await GetTodos()
      setInput('')
     }

    return (
      <div className="container mx-auto p-4">
      <div className="heading text-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600">TO-DO-APP</h1>
      </div>

      <div className="form flex justify-center gap-2 mb-4">
          <input
              className="shadow appearance-none border rounded py-2 px-3 text-grey-darker"
              type='text'
              value={input}
              onChange={handleChange}
              placeholder="Add a new todo"
          />
          <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={()=>addItem()}
          >
              ADD
          </button>
      </div>

      <div className="todolist space-y-2">  
          {items.map((item) => {
              const {_id, name} = item
              return <TodoItem key={item._id} name={name} id={_id} setItems={setItems} />   
          })}
      </div>
  </div>
    );
}

export default App;