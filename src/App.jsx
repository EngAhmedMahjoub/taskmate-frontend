import { useState, useEffect } from "react";
import TaskItem from './components/TaskItem'; 
import { useAuth } from "./contexts/AuthContext";
import AuthForm from "./components/AuthForm";
import { authFetch } from './services/api';

function App() {
  const { token, logout } = useAuth(); // Use auth state
  
  // Task state & logic
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  // If not logged in, show the auth form
  if (!token) return <AuthForm />;
  
  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const data = await authFetch('http://localhost:5276/api/tasks', 'GET', null, token);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  if (token) fetchTasks();
}, [token]);


  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `http://localhost:5276/api/tasks/${editTaskId}`
        : 'http://localhost:5276/api/tasks';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...newTask, isComplete: false }),
      });

      if (!response.ok) throw new Error(`${isEditing ? 'Update' : 'Add'} failed`);

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
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Delete failed');
      fetchTasks();
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">TaskMate</h1>
        <button onClick={logout} className="btn-secondary">Logout</button>
      </div>

      <button
        className="mb-4 text-sm underline"
        onClick={() => {
          document.documentElement.classList.toggle('dark');
        }}
      >
        Toggle Dark Mode
      </button>

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
          {isEditing ? "Update Task" : "Add Task"}
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
