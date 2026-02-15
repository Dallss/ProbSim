import { Link, useLocation } from 'react-router-dom';

const base = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';

export default function TopNav() {
  const location = useLocation();
  const isSimulator =
    location.pathname === base ||
    location.pathname === base + '/' ||
    (base === '' && location.pathname === '/');

  return (
    <nav className=" bg-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 max-w-6xl flex justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link
            to="/"
            className={`transition hover:text-gray-900 ${!isSimulator ? '' : 'text-gray-900 font-medium'}`}
          >
            Simulator
          </Link>
          <span className="text-gray-300 select-none" aria-hidden>·</span>
          <Link
            to="/learn"
            className={`transition hover:text-gray-900 ${isSimulator ? '' : 'text-gray-900 font-medium'}`}
          >
            Learn
          </Link>
        </div>
      </div>
    </nav>
  );
}
