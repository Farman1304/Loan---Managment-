import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signup({ email, password, displayName, role })
      navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err?.message || 'Signup failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-[70svh] place-items-center">
      <div className="card w-full max-w-md p-6">
        <h2 className="text-xl font-black text-slate-50">Create account</h2>
        <p className="mt-1 text-sm text-slate-300">
          Sign up and start applying for loans.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <div className="label">Name</div>
            <input
              className="input mt-2"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <div className="label">Email</div>
            <input
              className="input mt-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="label">Password</div>
            <input
              className="input mt-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <div className="mt-2 text-xs text-slate-400">
              Minimum 6 characters (Firebase Auth).
            </div>
          </div>

          <div>
            <div className="label">Role</div>
            <select
              className="input mt-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="mt-2 text-xs text-amber-200/80">
              For production apps, do not allow self-select admin.
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <button className="btn-primary w-full" disabled={busy}>
            {busy ? 'Creating...' : 'Sign up'}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-300">
          Already have an account?{' '}
          <Link className="font-semibold text-indigo-200 hover:underline" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

