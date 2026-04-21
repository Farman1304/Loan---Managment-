import { Link } from 'react-router-dom'
import { ShieldCheck, TrendingUp, Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Feature({ icon, title, desc }) {
  const IconComponent = icon

  return (
    <div className="card p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-200 ring-1 ring-indigo-500/20">
          <IconComponent className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-extrabold text-slate-50">{title}</div>
          <div className="mt-1 text-sm text-slate-300">{desc}</div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="space-y-10">
      <section className="card overflow-hidden">
        <div className="grid gap-8 p-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-200 ring-1 ring-emerald-500/20">
              Fintech Loan Portal
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-50 sm:text-4xl">
              Fast loan applications, real-time approvals.
            </h1>
            <p className="mt-3 text-slate-300">
              Apply for Personal, Business, or Home loans. Track status instantly.
              Admins can approve or reject in real-time with Firestore updates.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {user ? (
                <Link to="/portal" className="btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary">
                    Create account
                  </Link>
                  <Link to="/login" className="btn-secondary">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-emerald-500/10 to-transparent blur-2xl" />
            <div className="relative grid gap-4 sm:grid-cols-2">
              <Feature
                icon={Wallet}
                title="Simple Apply"
                desc="Minimal form with clean UX."
              />
              <Feature
                icon={TrendingUp}
                title="Live Status"
                desc="Pending / Approved / Rejected."
              />
              <div className="sm:col-span-2">
                <Feature
                  icon={ShieldCheck}
                  title="Role Based Access"
                  desc="Users see their loans, admins see all."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

