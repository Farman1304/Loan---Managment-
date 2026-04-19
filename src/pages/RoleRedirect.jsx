import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RoleRedirect() {
  const { profile } = useAuth()

  if (profile?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return <Navigate to="/dashboard" replace />
}

