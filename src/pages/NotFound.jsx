import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="grid min-h-[50svh] place-items-center">
      <div className="card max-w-md p-8 text-center">
        <div className="text-3xl font-black text-slate-50">404</div>
        <div className="mt-2 text-slate-300">Page not found.</div>
        <div className="mt-6">
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

