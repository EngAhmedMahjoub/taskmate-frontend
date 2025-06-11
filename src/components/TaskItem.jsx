const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  return (
    <li
  className={`card flex justify-between items-center ${
    task.isComplete ? 'opacity-50 line-through' : ''
    }`}
    >
      <div>
       <div className="font-semibold text-lg text-gray-800 dark:text-gray-100">{task.title}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{task.description}</div>
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
