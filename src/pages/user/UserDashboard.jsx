import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { db } from '../../firebase/firebase'
import { useAuth } from '../../context/AuthContext'

const categories = ['personal', 'business', 'home']

export default function UserDashboard() {
  const { user, profile } = useAuth()
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('personal')
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [loans, setLoans] = useState([])

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'loans'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
    )
    return onSnapshot(q, (snap) => {
      setLoans(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
  }, [user])

  const userName = useMemo(() => profile?.displayName || user?.displayName || user?.email || 'User', [profile, user])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) {
      setError('Please enter a valid loan amount.')
      return
    }
    setBusy(true)
    try {
      await addDoc(collection(db, 'loans'), {
        userId: user.uid,
        userName,
        amount: n,
        category,
        description,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      setAmount('')
      setCategory('personal')
      setDescription('')
    } catch (err) {
      setError(err?.message || 'Could not submit application')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-50">User Dashboard</h2>
        <p className="mt-1 text-sm text-slate-300">
          Apply for a loan and track your application status.
        </p>
      </div>

      <div className="card p-6">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-200">
          Loan Application
        </h3>

        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div>
            <div className="label">Loan Amount</div>
            <input
              className="input mt-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              inputMode="numeric"
            />
          </div>
          <div>
            <div className="label">Category</div>
            <select
              className="input mt-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c[0].toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <div className="label">Description</div>
            <textarea
              className="input mt-2 min-h-28 resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description..."
            />
          </div>

          {error ? (
            <div className="md:col-span-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="md:col-span-2">
            <button className="btn-primary w-full md:w-auto" disabled={busy}>
              {busy ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-50">My Applications</h3>
            <p className="text-sm text-slate-300">
              Your past loan applications and status.
            </p>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900">
                <tr className="text-slate-300">
                  <th className="px-4 py-3 font-semibold">Loan Amount</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loans.length ? (
                  loans.map((l) => (
                    <tr key={l.id} className="text-slate-200">
                      <td className="px-4 py-3 font-semibold text-slate-50">
                        {typeof l.amount === 'number'
                          ? l.amount.toLocaleString()
                          : l.amount}
                      </td>
                      <td className="px-4 py-3 capitalize">{l.category}</td>
                      <td className="px-4 py-3 capitalize">{l.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-400" colSpan={3}>
                      No applications yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

