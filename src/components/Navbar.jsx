import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const serif = '"Times New Roman", Times, Georgia, serif';
const LOCATION_LABELS = { lowell: 'Lowell', dorchester: 'Dorchester' };

const NAV_TABS = [
  { label: 'Close Register', shortLabel: 'Close', path: '/closing' },
  { label: 'Closing Logs',   shortLabel: 'Logs',  path: '/logs'    },
];

function fmtLong() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function fmtShort() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function Navbar() {
  const { clearLocation, getLocation } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const location = getLocation();

  const handleSwitch = () => {
    clearLocation();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-black/[0.08] sticky top-0 z-40">
      {/* Meta strip */}
      <div className="border-b border-black/[0.06]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-8 sm:h-9 flex items-center justify-between">
          {/* Date: full on md+, short on sm, hidden on xs */}
          <span className="text-[10px] text-[#8a8378] hidden sm:inline" style={{ fontFamily: serif, letterSpacing: '0.04em' }}>
            <span className="hidden md:inline">{fmtLong()}</span>
            <span className="sm:inline md:hidden">{fmtShort()}</span>
          </span>
          {/* Spacer on mobile so items stay right-aligned */}
          <span className="sm:hidden" />

          <div className="flex items-center gap-2 sm:gap-3">
            {location && (
              <>
                <div className="flex items-center gap-1">
                  <MapPin size={9} className="text-[#8a8378]" />
                  <span
                    className="text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.15em] text-[#8a8378]"
                    style={{ fontFamily: serif }}
                  >
                    {LOCATION_LABELS[location] ?? location}
                  </span>
                </div>
                <span className="text-black/15 hidden sm:inline">·</span>
              </>
            )}
            <button
              onClick={handleSwitch}
              className="flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.15em] text-[#8a8378] hover:text-[#111] active:opacity-60 transition-colors"
              style={{ fontFamily: serif }}
            >
              <LogOut size={9} />
              <span>Switch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Masthead + tabs */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between">
        <Link
          to="/"
          className="text-[24px] sm:text-[30px] leading-none text-[#111] no-underline"
          style={{ fontFamily: serif, fontStyle: 'italic', letterSpacing: '-0.02em' }}
        >
          ChaChing
        </Link>

        <nav className="flex items-center gap-0.5">
          {NAV_TABS.map(tab => {
            const active = pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="px-2.5 sm:px-4 py-1 sm:py-1.5 transition-all duration-150 no-underline"
                style={{
                  fontFamily: serif,
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  background: active ? '#111' : 'transparent',
                  color: active ? '#F7F4EE' : '#8a8378',
                  borderRadius: '1px',
                  whiteSpace: 'nowrap',
                }}
              >
                {/* Short label on mobile, full label on sm+ */}
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
