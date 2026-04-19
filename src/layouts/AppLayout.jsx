import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-app py-8">
        <Outlet />
      </main>
    </div>
  )
}

