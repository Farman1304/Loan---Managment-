import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setBusy(true)
    try {
      await login({ email, password })
      setSuccess('Login successful. Redirecting...')
      setBusy(false)
      window.setTimeout(() => {
        navigate('/portal', { replace: true })
      }, 500)
    } catch (err) {
      setError(err?.message || 'Login failed')
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-[70svh] place-items-center">
      <div className="card w-full max-w-md p-6">
        <h2 className="text-xl font-black text-slate-50">Login</h2>
        <p className="mt-1 text-sm text-slate-300">
          Welcome back. Sign in to continue.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
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
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
              {success}
            </div>
          ) : null}

          <button className="btn-primary w-full" disabled={busy}>
            {busy ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-300">
          No account?{' '}
          <Link className="font-semibold text-indigo-200 hover:underline" to="/signup">
            Create one
          </Link>
        </div>
      </div>
    </div>
  )
}

