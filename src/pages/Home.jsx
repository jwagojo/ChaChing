import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const serif = '"Times New Roman", Times, Georgia, serif';
const mono  = '"Courier New", Courier, monospace';

const LOCATION_LABELS = { lowell: 'Lowell', dorchester: 'Dorchester' };

function Home() {
  const { getLocation } = useAuth();
  const location = getLocation();

  return (
    <div className="min-h-screen bg-[#F7F4EE]" style={{ fontFamily: serif }}>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20">

        {/* Hero */}
        <div className="mb-14 sm:mb-20">
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="h-px flex-1 bg-black/10" />
            <span
              className="text-[10px] uppercase tracking-[0.24em] sm:tracking-[0.28em] text-[#8a8378]"
              style={{ fontFamily: serif }}
            >
              Register Closing
            </span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <h1
            className="text-[44px] sm:text-[56px] md:text-[64px] leading-[0.9] text-[#111] mb-5 sm:mb-6"
            style={{ fontFamily: serif, fontStyle: 'italic', letterSpacing: '-0.03em' }}
          >
            {location ? (LOCATION_LABELS[location] ?? location) : 'Welcome.'}
          </h1>

          <p
            className="text-[14px] sm:text-[16px] text-[#8a8378] italic mb-8 sm:mb-10 max-w-md"
            style={{ fontFamily: serif }}
          >
            Count your register, calculate the deposit, and log the closing — all in one place.
          </p>

          <Link
            to="/closing"
            className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.22em] no-underline transition-all duration-150 active:scale-[0.97]"
            style={{ fontFamily: serif, background: '#111', color: '#F7F4EE', borderRadius: '1px' }}
          >
            Close Register
            <ArrowRight size={11} />
          </Link>
        </div>

        {/* Feature cards */}
        <div className="h-px bg-black/[0.07] mb-10 sm:mb-14" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-black/[0.07]">
          {[
            {
              step: '01',
              title: 'Count Cash',
              desc: 'Enter bills, loose coins, and coin rolls. Totals calculate as you type.',
            },
            {
              step: '02',
              title: 'Calculate Split',
              desc: 'Keep $200 in the drawer. Everything above goes to the deposit envelope.',
            },
            {
              step: '03',
              title: 'Log & Archive',
              desc: 'Save each closing to the log. Filter by date or closer name anytime.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-[#F7F4EE] p-6 sm:p-8">
              <div
                className="text-[11px] uppercase tracking-[0.22em] text-[#8a8378] mb-4 sm:mb-5"
                style={{ fontFamily: mono }}
              >
                {step}
              </div>
              <h3
                className="text-[17px] sm:text-[18px] text-[#111] mb-2.5 sm:mb-3"
                style={{ fontFamily: serif, letterSpacing: '-0.01em' }}
              >
                {title}
              </h3>
              <p
                className="text-[13px] italic text-[#8a8378] leading-relaxed"
                style={{ fontFamily: serif }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Quick nav */}
        <div className="mt-10 sm:mt-14 flex gap-6 sm:gap-8">
          <Link
            to="/closing"
            className="text-[11px] sm:text-[12px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-[#8a8378] hover:text-[#111] no-underline active:opacity-60 transition-colors"
            style={{ fontFamily: serif }}
          >
            Close Register →
          </Link>
          <Link
            to="/logs"
            className="text-[11px] sm:text-[12px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-[#8a8378] hover:text-[#111] no-underline active:opacity-60 transition-colors"
            style={{ fontFamily: serif }}
          >
            View Logs →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8 mt-4">
        <div className="h-px bg-black/[0.07] mb-4 sm:mb-5" />
        <div className="flex items-center justify-between">
          <span className="text-[11px] italic text-[#8a8378]" style={{ fontFamily: serif }}>
            ChaChing — Register Closing Management
          </span>
          <span className="text-[10px] text-[#8a8378]" style={{ fontFamily: serif, letterSpacing: '0.08em' }}>
            © 2026
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
