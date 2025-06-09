const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  return (
    <li
      className={`flex justify-between items-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all ${
        task.isComplete ? 'opacity-50 line-through' : ''
      }`}
    >
      <div>
        <div className="font-semibold text-lg">{task.title}</div>
        <div className="text-sm text-gray-500">{task.description}</div>
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={task.isComplete}
          onChange={() => onToggleComplete(task)}
          className="w-5 h-5 cursor-pointer"
        />
        <button
          onClick={() => onEdit(task)}
          className="text-blue-600 hover:underline text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:underline text-sm"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
