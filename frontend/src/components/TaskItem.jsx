const STATUS_LABELS = { todo: 'To do', in_progress: 'In progress', done: 'Done' }

export default function TaskItem({ task, onStatusChange, onDelete }) {
  return (
    <div className={`task-item priority-${task.priority}`}>
      <div className="task-item-main">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <div className="task-meta">
          <span className={`badge status-${task.status}`}>{STATUS_LABELS[task.status]}</span>
          <span className={`badge priority-badge priority-${task.priority}`}>{task.priority}</span>
          {task.due_date && <span className="due">Due {new Date(task.due_date).toLocaleDateString()}</span>}
        </div>
      </div>
      <div className="task-item-actions">
        <select value={task.status} onChange={(e) => onStatusChange(task.id, e.target.value)}>
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <button className="danger" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  )
}
