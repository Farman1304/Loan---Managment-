import { NavLink } from 'react-router-dom'
import { FileText, LayoutDashboard, ShieldCheck } from 'lucide-react'

function Item({ to, icon, label }) {
  const IconComponent = icon

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition',
          isActive
            ? 'bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-500/25'
            : 'text-slate-200 hover:bg-slate-900',
        ].join(' ')
      }
    >
      <IconComponent className="h-4 w-4" />
      {label}
    </NavLink>
  )
}

export default function Sidebar({ role }) {
  return (
    <aside className="card hidden h-[calc(100svh-6rem)] w-64 shrink-0 p-3 md:block">
      <div className="mb-3 px-2 text-xs font-bold uppercase tracking-wide text-slate-400">
        Dashboard
      </div>

      <div className="flex flex-col gap-1">
        {role === 'admin' ? (
          <>
            <Item
              to="/admin"
              icon={ShieldCheck}
              label="Admin Overview"
            />
            <Item
              to="/admin"
              icon={FileText}
              label="Applications"
            />
          </>
        ) : (
          <>
            <Item
              to="/dashboard"
              icon={LayoutDashboard}
              label="My Dashboard"
            />
            <Item to="/dashboard" icon={FileText} label="My Loans" />
          </>
        )}
      </div>

      <div className="mt-6 border-t border-slate-800 pt-4">
        <div className="px-2 text-xs text-slate-400">
          Tip: Use the form to apply, then track status below.
        </div>
      </div>
    </aside>
  )
}

