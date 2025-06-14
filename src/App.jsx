import { useState, useEffect } from "react";
import TaskItem from './components/TaskItem'; 
import { useAuth } from "./contexts/AuthContext";
import AuthForm from "./components/AuthForm";

function App() {
  const { token, logout } = useAuth(); // Use auth state

  // If not logged in, show the auth form
  if (!token) return <AuthForm />;

  // Task state & logic
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
      <button
        className="mb-4 text-sm underline"
        onClick={() => {
        document.documentElement.classList.toggle('dark');
        }}
      >
  Toggle Dark Mode
</button>
      <h1 className="text-2xl font-bold mb-4">TaskMate</h1>

      {/* Form */}
      <form onSubmit={handleAddTask} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="input"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="input"
        />
        <button type="submit" className="btn-primary">
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
    className="btn-secondary"
  >
    Cancel
  </button>
)}

      </form>

      {/* Task List */}
      <ul className="space-y-2">
  {tasks.map((task) => (
    <TaskItem
      key={task.id}
      task={task}
      onEdit={handleEditTask}
      onDelete={handleDeleteTask}
      onToggleComplete={handleToggleComplete}
    />
  ))}
</ul>

    </div>
  );
}

export default App;
