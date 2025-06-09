import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5276/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5276/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      setNewTask({ title: '', description: '' }); // Reset form
      fetchTasks(); // Refresh list
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
  try {
    const response = await fetch(`http://localhost:5276/api/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Delete failed');
    fetchTasks(); // refresh list
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TaskMate</h1>

      {/* Form */}
      <form onSubmit={handleAddTask} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Task
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-2">
  {tasks.map((task) => (
    <li key={task.id} className="bg-gray-100 p-3 rounded shadow flex justify-between items-center">
      <div>
        <div className="font-semibold">{task.title}</div>
        <div className="text-sm text-gray-600">{task.description}</div>
        <div className="text-xs mt-1">
          Status:{" "}
          <span className={task.isComplete ? "text-green-600" : "text-red-500"}>
            {task.isComplete ? "Completed" : "Pending"}
          </span>
        </div>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => handleEditTask(task)}
          className="text-white bg-blue-500 px-2 py-1 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteTask(task.id)}
          className="text-white bg-red-500 px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </li>
  ))}
  </ul>

    </div>
  );
}

export default App;
