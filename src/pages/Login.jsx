import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';

const serif = '"Times New Roman", Times, Georgia, serif';
const LOCATIONS = ['Lowell', 'Dorchester'];

function Login() {
  const { selectLocation } = useAuth();
  const navigate = useNavigate();
  const [hov, setHov] = useState(null);

  const handleSelect = (label) => {
    selectLocation(label.toLowerCase());
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden"
      style={{ background: '#111111' }}
    >
      {/* Top rule — hidden on very small screens */}
      <div className="hidden sm:block absolute top-8 inset-x-0 px-10">
        <div className="max-w-lg mx-auto flex items-center gap-5">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[9px] uppercase tracking-[0.28em] text-white/25" style={{ fontFamily: serif }}>
            Est. 2026
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
      </div>

      {/* Brand mark */}
      <div className="text-center mb-12 sm:mb-16">
        <h1
          className="text-[58px] sm:text-[72px] md:text-[88px] leading-[0.9] text-[#F7F4EE]"
          style={{ fontFamily: serif, fontStyle: 'italic', letterSpacing: '-0.03em' }}
        >
          ChaChing
        </h1>
        <div className="mx-auto w-24 sm:w-32 h-px bg-white/15 mt-5 mb-4 sm:mt-6 sm:mb-5" />
        <p
          className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] sm:tracking-[0.26em] text-white/35"
          style={{ fontFamily: serif }}
        >
          Register Closing Management
        </p>
      </div>

      {/* Location picker */}
      <div className="w-full max-w-[340px]">
        <p
          className="text-[9px] uppercase tracking-[0.22em] text-white/20 text-center mb-5 sm:mb-6"
          style={{ fontFamily: serif }}
        >
          Select your location
        </p>

        {LOCATIONS.map((loc, i) => (
          <button
            key={loc}
            onClick={() => handleSelect(loc)}
            onMouseEnter={() => setHov(loc)}
            onMouseLeave={() => setHov(null)}
            className="w-full flex items-center justify-between py-5 px-1 transition-all duration-200 active:opacity-60"
            style={{ borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
          >
            <span
              className="text-[26px] sm:text-[30px] transition-colors duration-200"
              style={{
                fontFamily: serif,
                fontStyle: 'italic',
                color: hov === loc ? '#F7F4EE' : 'rgba(247,244,238,0.45)',
                letterSpacing: '-0.01em',
              }}
            >
              {loc}
            </span>
            <ArrowRight
              size={14}
              style={{
                color: hov === loc ? 'rgba(247,244,238,0.9)' : 'rgba(247,244,238,0.2)',
                transform: hov === loc ? 'translateX(5px)' : 'none',
                transition: 'all 0.2s',
              }}
            />
          </button>
        ))}
      </div>

      {/* Bottom rule */}
      <div className="hidden sm:block absolute bottom-8 inset-x-0 px-10">
        <div className="max-w-lg mx-auto flex items-center gap-5">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[9px] text-white/15" style={{ fontFamily: serif, letterSpacing: '0.1em' }}>
            All Locations · All Registers
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default Login;
