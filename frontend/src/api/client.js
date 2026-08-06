const API_BASE_URL = import.meta.env.VITE_API_URL ||  "https://taskmanager-fullstack-ind0l.vercel.app";

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let detail = 'Something went wrong'
    try {
      const data = await res.json()
      detail = data.detail || detail
    } catch {
      // response had no JSON body
    }
    throw new Error(detail)
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data }),
  me: (token) => request('/auth/me', { token }),

  listTasks: (token, status) =>
    request(`/tasks/${status ? `?status=${status}` : ''}`, { token }),
  createTask: (token, data) => request('/tasks/', { method: 'POST', body: data, token }),
  updateTask: (token, id, data) =>
    request(`/tasks/${id}`, { method: 'PUT', body: data, token }),
  deleteTask: (token, id) => request(`/tasks/${id}`, { method: 'DELETE', token }),
}
