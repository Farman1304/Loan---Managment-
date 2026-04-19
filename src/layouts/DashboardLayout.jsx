import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout() {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-app py-8">
        <div className="flex gap-6">
          <Sidebar role={profile?.role} />
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}

