import { useEffect, useMemo, useState } from 'react'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { Users, Wallet, ClipboardList, TrendingUp } from 'lucide-react'
import { db } from '../../firebase/firebase'
import StatCard from '../../components/StatCard'
import LoanTable from '../../components/LoanTable'

export default function AdminDashboard() {
  const [loans, setLoans] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    const unsubLoans = onSnapshot(collection(db, 'loans'), (snap) => {
      setLoans(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return () => {
      unsubLoans()
      unsubUsers()
    }
  }, [])

  const stats = useMemo(() => {
    const totalLoans = loans.length
    const totalApplicants = new Set(loans.map((l) => l.userId).filter(Boolean)).size
    const totalUsers = users.length
    const recoveryPosition = loans
      .filter((l) => l.status === 'approved')
      .reduce((sum, l) => sum + (Number(l.amount) || 0), 0)

    return { totalLoans, totalApplicants, totalUsers, recoveryPosition }
  }, [loans, users])

  async function setStatus(row, status) {
    await updateDoc(doc(db, 'loans', row.id), { status })
  }

  const rows = useMemo(() => {
    // newest first is fine for admin; if you want orderBy we can add it (requires createdAt index).
    return [...loans].sort((a, b) => {
      const at = a?.createdAt?.seconds || 0
      const bt = b?.createdAt?.seconds || 0
      return bt - at
    })
  }, [loans])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-50">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-slate-300">
          Review applications and manage approvals in real-time.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Loans"
          value={stats.totalLoans}
          icon={Wallet}
          tone="indigo"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          tone="emerald"
        />
        <StatCard
          title="Total Applicants"
          value={stats.totalApplicants}
          icon={ClipboardList}
          tone="amber"
        />
        <StatCard
          title="Recovery Position"
          value={stats.recoveryPosition.toLocaleString()}
          icon={TrendingUp}
          tone="emerald"
        />
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-black text-slate-50">Applicants</h3>
          <p className="text-sm text-slate-300">
            Approve or reject pending applications.
          </p>
        </div>

        <LoanTable
          rows={rows.map((r) => ({
            id: r.id,
            userName: r.userName,
            amount: r.amount,
            category: r.category,
            status: r.status,
          }))}
          showActions
          onApprove={(r) => setStatus(r, 'approved')}
          onReject={(r) => setStatus(r, 'rejected')}
        />
      </div>
    </div>
  )
}

