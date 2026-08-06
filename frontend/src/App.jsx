import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()
  if (loading) return <div className="center-page">Loading…</div>
  return token ? children : <Navigate to="/login" replace />
}

function PublicOnlyRoute({ children }) {
  const { token, loading } = useAuth()
  if (loading) return <div className="center-page">Loading…</div>
  return token ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
    </Routes>
  )
}
