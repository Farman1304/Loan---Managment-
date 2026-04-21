import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const isElevatedRole = (value) => value === 'admin' || value === 'owner'

export default function RoleRedirect() {
  const { profile } = useAuth()

  if (isElevatedRole(profile?.role)) {
    return <Navigate to="/admin" replace />
  }

  return <Navigate to="/dashboard" replace />
}

