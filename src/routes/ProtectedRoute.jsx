import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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

  if (role && profile?.role !== role) {
    return <Navigate to={profile?.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return <Outlet />
}

