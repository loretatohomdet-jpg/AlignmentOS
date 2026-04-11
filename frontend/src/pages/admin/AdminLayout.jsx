import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { to: '/admin/overview', label: 'Overview' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/assessments', label: 'Assessments' },
  { to: '/admin/leads', label: 'Leads' },
];

export default function AdminLayout() {
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-alignment-accent/70">
          Users, plans, assessments, analytics, and support notes.
        </p>
        <nav className="mt-6 flex flex-wrap gap-2 border-b border-alignment-accent/10 pb-4" aria-label="Admin sections">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.to === '/admin/overview'}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-alignment-primary text-white'
                    : 'text-alignment-accent/80 hover:bg-alignment-accent/5'
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
