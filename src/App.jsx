import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

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
    const url = isEditing
      ? `http://localhost:5276/api/tasks/${editTaskId}`
      : 'http://localhost:5276/api/tasks';
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTask, isComplete: false }),
    });

    if (!response.ok) throw new Error(`${isEditing ? 'Update' : 'Add'} failed`);

    // Reset
    setNewTask({ title: '', description: '' });
    setIsEditing(false);
    setEditTaskId(null);
    fetchTasks();
  } catch (error) {
    console.error('Error:', error);
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

const handleEditTask = (task) => {
  setIsEditing(true);
  setEditTaskId(task.id);
  setNewTask({ title: task.title, description: task.description });
};

const handleToggleComplete = async (task) => {
  try {
    const updatedTask = {
      ...task,
      isComplete: !task.isComplete
    };

    const response = await fetch(`http://localhost:5276/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) throw new Error('Toggle failed');
    fetchTasks();
  } catch (error) {
    console.error('Error toggling task:', error);
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
        {isEditing && (
  <button
    type="button"
    onClick={() => {
      setIsEditing(false);
      setEditTaskId(null);
      setNewTask({ title: '', description: '' });
    }}
    className="ml-2 text-gray-700"
  >
    Cancel
  </button>
)}

      </form>

      {/* Task List */}
      <ul className="space-y-2">
  {tasks.map((task) => (
    <li
      key={task.id}
      className={`flex justify-between items-center bg-gray-100 p-3 rounded shadow ${
        task.isComplete ? 'opacity-60 line-through' : ''
      }`}
    >
      <div>
        <div className="font-medium">{task.title}</div>
        <div className="text-sm text-gray-600">{task.description}</div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={task.isComplete}
          onChange={() => handleToggleComplete(task)}
          className="w-5 h-5"
        />
        <button
          onClick={() => handleEditTask(task)}
          className="text-blue-500 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteTask(task.id)}
          className="text-red-500 hover:underline"
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
