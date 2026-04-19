const badge = (status) => {
  const base =
    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1'
  if (status === 'approved')
    return `${base} bg-emerald-500/10 text-emerald-200 ring-emerald-500/20`
  if (status === 'rejected')
    return `${base} bg-rose-500/10 text-rose-200 ring-rose-500/20`
  return `${base} bg-amber-500/10 text-amber-200 ring-amber-500/20`
}

export default function LoanTable({
  rows,
  showActions = false,
  onApprove,
  onReject,
}) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-900">
            <tr className="text-slate-300">
              <th className="px-4 py-3 font-semibold">User Name</th>
              <th className="px-4 py-3 font-semibold">Loan Amount</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              {showActions ? (
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.length ? (
              rows.map((r) => (
                <tr key={r.id} className="text-slate-200">
                  <td className="px-4 py-3">{r.userName || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-slate-50">
                    {typeof r.amount === 'number' ? r.amount.toLocaleString() : r.amount}
                  </td>
                  <td className="px-4 py-3 capitalize">{r.category}</td>
                  <td className="px-4 py-3">
                    <span className={badge(r.status)}>{r.status}</span>
                  </td>
                  {showActions ? (
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn-primary disabled:opacity-50"
                          disabled={r.status !== 'pending'}
                          onClick={() => onApprove?.(r)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-secondary disabled:opacity-50"
                          disabled={r.status !== 'pending'}
                          onClick={() => onReject?.(r)}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-4 py-10 text-center text-slate-400"
                  colSpan={showActions ? 5 : 4}
                >
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

