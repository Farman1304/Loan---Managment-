import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './routes/ProtectedRoute'

import Home from './pages/Home'
import Contact from './pages/Contact'
import Branches from './pages/Branches'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import UserDashboard from './pages/user/UserDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import RoleRedirect from './pages/RoleRedirect'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="branches" element={<Branches />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoute role="user" />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="portal" element={<RoleRedirect />} />
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<DashboardLayout />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
