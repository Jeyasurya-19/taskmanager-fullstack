import { useState } from 'react'

const empty = { title: '', description: '', status: 'todo', priority: 'medium', due_date: '' }

export default function TaskForm({ onSubmit, initial = empty, submitLabel = 'Add task' }) {
  const [form, setForm] = useState(initial)
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { ...form, due_date: form.due_date || null }
    onSubmit(payload)
    if (submitLabel === 'Add task') setForm(empty)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input placeholder="Task title" value={form.title} onChange={update('title')} required />
      <textarea placeholder="Description (optional)" value={form.description || ''} onChange={update('description')} />
      <div className="task-form-row">
        <select value={form.status} onChange={update('status')}>
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <select value={form.priority} onChange={update('priority')}>
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input type="date" value={form.due_date ? form.due_date.slice(0, 10) : ''} onChange={update('due_date')} />
      </div>
      <button type="submit">{submitLabel}</button>
    </form>
  )
}
