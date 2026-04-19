export default function StatCard({ title, value, icon: Icon, tone = 'indigo' }) {
  const toneClasses =
    tone === 'emerald'
      ? 'bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20'
      : tone === 'amber'
        ? 'bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/20'
        : 'bg-indigo-500/10 text-indigo-200 ring-1 ring-indigo-500/20'

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-300">{title}</div>
          <div className="mt-2 text-2xl font-black tracking-tight text-slate-50">
            {value}
          </div>
        </div>
        {Icon ? (
          <div className={['grid h-10 w-10 place-items-center rounded-xl', toneClasses].join(' ')}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </div>
  )
}

