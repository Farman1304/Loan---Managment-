import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const isElevatedRole = (value) => value === 'admin' || value === 'owner'

export default function ProtectedRoute({ role }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-[50svh] place-items-center">
        <div className="card p-6 text-slate-200">Loading...</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (role) {
    if (role === 'admin' && isElevatedRole(profile?.role)) {
      return <Outlet />
    }
    if (role !== 'admin' && profile?.role !== role) {
      return <Navigate to={isElevatedRole(profile?.role) ? '/admin' : '/dashboard'} replace />
    }
    if (role === 'admin' && !isElevatedRole(profile?.role)) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return <Outlet />
}

