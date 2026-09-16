import { NavLink, useLocation } from 'react-router-dom';

const tabs = [
  { to: '/practice', label: 'Today', prefix: '/practice' },
  { to: '/reflect', label: 'Review' },
  { to: '/journey', label: 'Journey' },
  { to: '/more', label: 'More' },
];

export default function EngineTabBar() {
  const { pathname } = useLocation();

  return (
    <nav
      className="sticky bottom-0 z-40 border-t border-alignment-accent/[0.08] bg-alignment-foundation/95 backdrop-blur-md pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      aria-label="Habit Engine"
    >
      <div className="mx-auto grid max-w-xl grid-cols-4 px-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.to}
            className={() => {
              const active = tab.prefix ? pathname.startsWith(tab.prefix) : pathname === tab.to;
              return `flex min-h-14 items-center justify-center text-[10px] sm:text-[11px] font-normal uppercase tracking-[0.22em] ${
                active ? 'text-alignment-primary' : 'text-alignment-accent/35 hover:text-alignment-accent/70'
              }`;
            }}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
