import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Load tasks on page load
  useEffect(() => {
    fetch("http://localhost:5276/api/tasks")
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Error fetching tasks:", err));
  }, []);

  // Add Task
  const handleAddTask = async () => {
    const newTask = { title, description };
    try {
      const res = await fetch("http://localhost:5276/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        const createdTask = await res.json();
        setTasks([...tasks, createdTask]);
        setTitle("");
        setDescription("");
      } else {
        console.error("Failed to create task:", res.status);
      }
    } catch (err) {
      console.error("Request error:", err);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">TaskMate</h1>

      <div className="mb-4">
        <input
          className="border p-2 w-full mb-2"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>

      <ul>
        {tasks.map(task => (
          <li key={task.id} className="border-b py-2">
            <strong>{task.title}</strong>: {task.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
