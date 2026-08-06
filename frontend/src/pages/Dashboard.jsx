import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import TaskForm from '../components/TaskForm'
import TaskItem from '../components/TaskItem'

export default function Dashboard() {
  const { token, user, logout } = useAuth()
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadTasks = async () => {
    setLoading(true)
    try {
      const data = await api.listTasks(token, filter || undefined)
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTasks() }, [filter])

  const handleCreate = async (payload) => {
    try {
      await api.createTask(token, payload)
      loadTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateTask(token, id, { status })
      loadTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteTask(token, id)
      loadTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Task Manager</h1>
          <p>Welcome back, {user?.name}</p>
        </div>
        <button className="secondary" onClick={logout}>Log out</button>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="dashboard-grid">
        <div className="panel">
          <h2>New task</h2>
          <TaskForm onSubmit={handleCreate} />
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Your tasks</h2>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All</option>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {loading ? (
            <p>Loading…</p>
          ) : tasks.length === 0 ? (
            <p className="empty">No tasks yet — add your first one.</p>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
