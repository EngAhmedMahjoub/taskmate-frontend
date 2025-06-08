import { useEffect, useState } from "react";
import { getTasks, deleteTask } from "../services/taskService";

function TaskList({ onEdit }) {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
      loadTasks();
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Task List</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="p-3 border rounded-md shadow flex justify-between items-center">
            <span>{task.title}</span>
            <div className="space-x-2">
              <button className="text-blue-600" onClick={() => onEdit(task)}>Edit</button>
              <button className="text-red-600" onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
