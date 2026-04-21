import { useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinkBase =
  'inline-flex items-center rounded-xl px-3 py-2 text-sm font-semibold transition'

function NavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          navLinkBase,
          isActive
            ? 'bg-slate-800 text-slate-50'
            : 'text-slate-200 hover:bg-slate-900 hover:text-slate-50',
        ].join(' ')
      }
      onClick={onClick}
    >
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { user, profile, logout } = useAuth()

  const links = useMemo(() => {
    const baseLinks = [
      { to: '/', label: 'Home' },
      { to: '/contact', label: 'Contact' },
      { to: '/branches', label: 'Branches' },
      { to: '/about', label: 'About Us' },
    ]

    if (!user) return baseLinks

    if (profile?.role === 'admin') {
      return [...baseLinks, { to: '/admin', label: 'Admin Dashboard' }]
    }

    return [...baseLinks, { to: '/dashboard', label: 'Apply Loan' }]
  }, [user, profile?.role])

  async function onLogout() {
    await logout()
    setOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="container-app">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-slate-950">
              <span className="text-sm font-black">LM</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold text-slate-50">
                Loan Manager
              </div>
              <div className="text-xs text-slate-400">
                {profile?.role === 'admin' ? 'Admin' : 'Fintech Portal'}
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavItem key={l.to} to={l.to}>
                {l.label}
              </NavItem>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <span className="hidden text-sm text-slate-300 lg:inline">
                  {profile?.displayName || user.email}
                </span>
                <button onClick={onLogout} className="btn-secondary">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn-secondary" to="/login">
                  Login
                </Link>
                <Link className="btn-primary" to="/signup">
                  Create account
                </Link>
              </>
            )}
          </div>

          <button
            className="btn-secondary md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-slate-800 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <NavItem key={l.to} to={l.to} onClick={() => setOpen(false)}>
                  {l.label}
                </NavItem>
              ))}
              <div className="mt-2 flex flex-col gap-2">
                {user ? (
                  <button onClick={onLogout} className="btn-secondary w-full">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                ) : (
                  <>
                    <Link className="btn-secondary w-full" to="/login" onClick={() => setOpen(false)}>
                      Login
                    </Link>
                    <Link className="btn-primary w-full" to="/signup" onClick={() => setOpen(false)}>
                      Create account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}

