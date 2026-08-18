import { Link, useLocation } from 'react-router-dom';

const base = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';

const NAV_ITEMS = [
  { to: '/', label: 'Simulator' },
  { to: '/learn', label: 'Learn' },
  { to: '/non-probability', label: 'Non-Probability' },
];

export default function TopNav() {
  const location = useLocation();
  const pathname =
    base && location.pathname.startsWith(base)
      ? location.pathname.slice(base.length) || '/'
      : location.pathname;

  return (
    <nav className=" bg-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 max-w-6xl flex justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = pathname === item.to;
            return (
              <span key={item.to} className="flex items-center gap-2">
                {idx > 0 && <span className="text-gray-300 select-none" aria-hidden>·</span>}
                <Link
                  to={item.to}
                  className={`transition hover:text-gray-900 ${isActive ? 'text-gray-900 font-medium' : ''}`}
                >
                  {item.label}
                </Link>
              </span>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
