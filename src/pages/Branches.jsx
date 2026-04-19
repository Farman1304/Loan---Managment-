const branches = [
  { name: 'Main Branch', city: 'Islamabad', phone: '+92 000 0000000' },
  { name: 'City Branch', city: 'Lahore', phone: '+92 000 0000000' },
  { name: 'Market Branch', city: 'Karachi', phone: '+92 000 0000000' },
]

export default function Branches() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-slate-50">Branches</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {branches.map((b) => (
          <div key={b.name} className="card p-5">
            <div className="text-sm font-extrabold text-slate-50">{b.name}</div>
            <div className="mt-1 text-sm text-slate-300">{b.city}</div>
            <div className="mt-3 text-xs font-bold text-slate-400">{b.phone}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

