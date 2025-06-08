import { useState, useEffect } from "react";
import { createTask, updateTask } from "../services/taskService";

function TaskForm({ editingTask, onSuccess }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingTask) {
      await updateTask(editingTask.id, { id: editingTask.id, title });
    } else {
      await createTask({ title });
    }

    setTitle("");
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <h2 className="text-xl font-semibold">{editingTask ? "Edit Task" : "Add Task"}</h2>
      <input
        type="text"
        className="border p-2 rounded w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;
