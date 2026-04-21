import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { db } from '../../firebase/firebase'
import { useAuth } from '../../context/AuthContext'

const categories = ['personal', 'business', 'home']
const durationOptions = [2, 4, 6]
const rateByDuration = {
  2: 2,
  4: 4,
  6: 6,
}

export default function UserDashboard() {
  const { user, profile } = useAuth()
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('personal')
  const [purpose, setPurpose] = useState('')
  const [durationYears, setDurationYears] = useState(2)
  const [installmentCount, setInstallmentCount] = useState('')
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
    const installments = Number(installmentCount)
    if (!Number.isInteger(installments) || installments <= 0) {
      setError('Please enter a valid number of installments.')
      return
    }
    const maxInstallments = Number(durationYears) * 12
    if (installments > maxInstallments) {
      setError(`Installments cannot exceed ${maxInstallments} for a ${durationYears}-year duration.`)
      return
    }
    if (!purpose.trim()) {
      setError('Please provide loan purpose.')
      return
    }
    if (category !== 'home') {
      setError('Only Home Loan applications are allowed.')
      return
    }

    const chargeRate = rateByDuration[durationYears]
    const serviceCharge = (n * chargeRate) / 100
    const totalPayable = n + serviceCharge
    const installmentAmount = totalPayable / installments

    setBusy(true)
    try {
      await addDoc(collection(db, 'loans'), {
        userId: user.uid,
        userName,
        amount: n,
        category,
        purpose: purpose.trim(),
        durationYears,
        installmentCount: installments,
        chargeRate,
        serviceCharge,
        totalPayable,
        installmentAmount,
        status: 'pending',
        rejectionReason: '',
        createdAt: serverTimestamp(),
      })
      setAmount('')
      setCategory('home')
      setPurpose('')
      setDurationYears(2)
      setInstallmentCount('')
    } catch (err) {
      setError(err?.message || 'Could not submit application')
    } finally {
      setBusy(false)
    }
  }

  const installmentHint = Number(durationYears) * 12

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
            <div className="label">Loan Type</div>
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
            <p className="mt-2 text-xs text-slate-400">
              Policy: only Home Loan applications are accepted.
            </p>
          </div>

          <div>
            <div className="label">Duration (Years)</div>
            <select
              className="input mt-2"
              value={durationYears}
              onChange={(e) => setDurationYears(Number(e.target.value))}
            >
              {durationOptions.map((years) => (
                <option key={years} value={years}>
                  {years} years ({rateByDuration[years]}% charge)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="label">Installments</div>
            <input
              className="input mt-2"
              value={installmentCount}
              onChange={(e) => setInstallmentCount(e.target.value)}
              placeholder={`e.g. ${installmentHint}`}
              inputMode="numeric"
            />
            <p className="mt-2 text-xs text-slate-400">
              Maximum {installmentHint} installments for selected duration.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="label">Purpose</div>
            <textarea
              className="input mt-2 min-h-28 resize-y"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Why do you need this home loan?"
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
                  <th className="px-4 py-3 font-semibold">Purpose</th>
                  <th className="px-4 py-3 font-semibold">Duration</th>
                  <th className="px-4 py-3 font-semibold">Installments</th>
                  <th className="px-4 py-3 font-semibold">Charge</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Admin Comment</th>
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
                      <td className="px-4 py-3">{l.purpose || '—'}</td>
                      <td className="px-4 py-3">
                        {l.durationYears ? `${l.durationYears} years` : '—'}
                      </td>
                      <td className="px-4 py-3">{l.installmentCount || '—'}</td>
                      <td className="px-4 py-3">
                        {typeof l.chargeRate === 'number' ? `${l.chargeRate}%` : '—'}
                      </td>
                      <td className="px-4 py-3 capitalize">{l.status}</td>
                      <td className="px-4 py-3">
                        {l.status === 'rejected' && l.rejectionReason
                          ? l.rejectionReason
                          : '—'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-400" colSpan={7}>
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

