import { NavLink, Outlet } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { ADMIN_NAV, TONE } from './adminShared';

export default function AdminLayout() {
  usePageTitle('Admin — Alignment OS');
  return (
    <div className="w-full bg-gradient-to-b from-[#F7F5F0] via-[#F3EFE4] to-[#EDE8DC] min-h-full">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        <header className="rounded-3xl bg-[#2c2e26] text-[#F7F5F0] px-6 sm:px-8 py-7 sm:py-8 shadow-apple-lg">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#C4A35A]">Operators</p>
          <h1 className="mt-2 font-display font-medium text-3xl sm:text-4xl">Admin desk</h1>
          <p className="mt-2 text-sm text-white/75 max-w-xl">
            Create, edit, and remove pages, products, people, questions, habits, and inbox leads. Pick a colour-coded room.
          </p>
        </header>

        <nav className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" aria-label="Admin sections">
          {ADMIN_NAV.map((item) => {
            const tone = TONE[item.tone];
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-2xl p-4 transition-transform hover:-translate-y-0.5 ${tone.soft} ${
                    isActive ? `ring-2 ring-offset-2 ring-offset-[#F3EFE4] ${tone.bg.replace('bg-', 'ring-')}` : ''
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${tone.chip}`}>
                      {item.label}
                    </span>
                    <p className={`mt-2 text-sm font-medium ${isActive ? tone.text : 'text-alignment-accent'}`}>
                      {item.hint}
                    </p>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
