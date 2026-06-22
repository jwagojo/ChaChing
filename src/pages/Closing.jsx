import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logService } from '../services/logService';
import jsPDF from 'jspdf';

const serif = '"Times New Roman", Times, Georgia, serif';
const mono  = '"Courier New", Courier, monospace';

const $$ = (n) => Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const DENOMINATIONS = [
  { section: 'Bills',       key: 'hundreds',     label: 'One Hundred Dollars',    unit: 100  },
  { section: 'Bills',       key: 'fifties',      label: 'Fifty Dollars',          unit: 50   },
  { section: 'Bills',       key: 'twenties',     label: 'Twenty Dollars',         unit: 20   },
  { section: 'Bills',       key: 'tens',         label: 'Ten Dollars',            unit: 10   },
  { section: 'Bills',       key: 'fives',        label: 'Five Dollars',           unit: 5    },
  { section: 'Bills',       key: 'ones',         label: 'One Dollar',             unit: 1    },
  { section: 'Loose Coins', key: 'quarters',     label: 'Quarters  (25¢)',        unit: 0.25 },
  { section: 'Loose Coins', key: 'dimes',        label: 'Dimes  (10¢)',           unit: 0.10 },
  { section: 'Loose Coins', key: 'nickels',      label: 'Nickels  (5¢)',          unit: 0.05 },
  { section: 'Loose Coins', key: 'pennies',      label: 'Pennies  (1¢)',          unit: 0.01 },
  { section: 'Coin Rolls',  key: 'quarterRolls', label: 'Quarter Rolls  ($10)',   unit: 10   },
  { section: 'Coin Rolls',  key: 'dimeRolls',    label: 'Dime Rolls  ($5)',       unit: 5    },
  { section: 'Coin Rolls',  key: 'nickelRolls',  label: 'Nickel Rolls  ($2)',     unit: 2    },
  { section: 'Coin Rolls',  key: 'pennyRolls',   label: 'Penny Rolls  (50¢)',     unit: 0.50 },
];

const EMPTY_COUNTS = {
  hundreds: '', fifties: '', twenties: '', tens: '', fives: '', ones: '',
  quarters: '', dimes: '', nickels: '', pennies: '',
  quarterRolls: '', dimeRolls: '', nickelRolls: '', pennyRolls: '',
};

const SAFE_BASE = 200;

// ─── Denomination Row ─────────────────────────────────────────────────────────

function DRow({ label, unit, count, onChange }) {
  const n = parseInt(count) || 0;
  const sub = n * unit;

  const decrement = () => onChange(Math.max(0, n - 1).toString());
  const increment = () => onChange((n + 1).toString());

  return (
    <div
      className="grid items-center py-2 border-b border-black/[0.055] last:border-0"
      style={{ gridTemplateColumns: '1fr auto 72px', gap: '8px' }}
    >
      <span className="text-[13px] sm:text-[14px] text-[#2a2a2a]" style={{ fontFamily: serif }}>{label}</span>

      {/* Stepper */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={decrement}
          disabled={n === 0}
          className="w-6 h-6 flex items-center justify-center text-[#8a8378] hover:text-[#111] active:bg-black/5 disabled:opacity-20 disabled:cursor-not-allowed transition-colors rounded-sm select-none"
          style={{ fontFamily: mono, fontSize: '16px', lineHeight: 1 }}
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min="0"
          value={count}
          onChange={e => onChange(e.target.value)}
          placeholder="0"
          className="w-9 text-center text-[13px] sm:text-[14px] text-[#111] bg-transparent border-0 border-b border-black/20 focus:border-black focus:outline-none pb-0.5 transition-colors duration-150 placeholder-black/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ fontFamily: mono }}
        />
        <button
          type="button"
          onClick={increment}
          className="w-6 h-6 flex items-center justify-center text-[#8a8378] hover:text-[#111] active:bg-black/5 transition-colors rounded-sm select-none"
          style={{ fontFamily: mono, fontSize: '16px', lineHeight: 1 }}
        >
          +
        </button>
      </div>

      <span className="text-right text-[12px] sm:text-[13px] text-[#8a8378]" style={{ fontFamily: mono }}>
        {sub > 0 ? $$(sub) : ''}
      </span>
    </div>
  );
}

// ─── Section Divider ──────────────────────────────────────────────────────────

function LedgerSection({ title, children }) {
  return (
    <div className="mb-1">
      <div className="flex items-center gap-3 sm:gap-4 pt-6 sm:pt-7 pb-3">
        <div className="h-px flex-1 bg-black/10" />
        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8378]" style={{ fontFamily: serif }}>
          {title}
        </span>
        <div className="h-px flex-1 bg-black/10" />
      </div>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Closing() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingLog = location.state?.editingLog;

  const [counts, setCounts] = useState(EMPTY_COUNTS);
  const [closer, setCloser] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (editingLog) {
      setIsEditMode(true);
      setEditingId(editingLog.id);
      setCloser(editingLog.closer);
      setCounts(editingLog.counts);
    }
  }, [editingLog]);

  const total   = DENOMINATIONS.reduce((sum, { key, unit }) => sum + (parseInt(counts[key]) || 0) * unit, 0);
  const deposit = Math.max(0, Math.round((total - SAFE_BASE) * 100) / 100);
  const safe    = Math.min(total, SAFE_BASE);

  const buildSteps = () => {
    if (deposit <= 0) return ['No deposit needed — drawer is at base.'];
    const steps = [];
    let rem = deposit;
    const tiers = [
      { key: 'hundreds', unit: 100, label: '$100 bills', min: 0 },
      { key: 'fifties',  unit: 50,  label: '$50 bills',  min: 0 },
      { key: 'twenties', unit: 20,  label: '$20 bills',  min: 0 },
      { key: 'tens',     unit: 10,  label: '$10 bills',  min: 5 },
      { key: 'fives',    unit: 5,   label: '$5 bills',   min: 5 },
      { key: 'ones',     unit: 1,   label: '$1 bills',   min: 5 },
    ];
    for (const { key, unit, label, min } of tiers) {
      if (rem < 0.01) break;
      const avail = parseInt(counts[key]) || 0;
      const pull = Math.min(Math.max(0, avail - min), Math.floor(rem / unit));
      if (pull > 0) {
        steps.push(`${pull} × ${label}  =  ${$$(pull * unit)}`);
        rem = Math.round((rem - pull * unit) * 100) / 100;
      }
    }
    if (rem > 0.01) steps.push(`Short ${$$(rem)} — supplement with coins`);
    return steps;
  };

  const steps = buildSteps();

  const handleCountChange = (key, value) => {
    setCounts(prev => ({
      ...prev,
      [key]: value === '' ? '' : Math.max(0, parseInt(value) || 0).toString(),
    }));
  };

  const logRegisterClosing = async () => {
    if (!closer.trim()) { setSaveStatus('Enter your name to save.'); return; }
    if (total === 0)    { setSaveStatus('Enter cash counts before logging.'); return; }

    setIsSaving(true);
    setSaveStatus(isEditMode ? 'Updating...' : 'Saving...');

    try {
      const closingData = {
        closer: closer.trim(),
        counts,
        totalAmount: total,
        safeAmount: safe,
        revenueAmount: deposit,
        closingInstructions: steps.join('\n'),
      };
      if (isEditMode) {
        await logService.updateLog(editingId, closingData);
      } else {
        await logService.saveLog(closingData);
      }
      setSavedFlash(true);
      setCounts(EMPTY_COUNTS);
      setCloser('');
      setSaveStatus('');
      setIsEditMode(false);
      setEditingId(null);
      setTimeout(() => { setSavedFlash(false); navigate('/logs'); }, 1500);
    } catch (error) {
      setSaveStatus(error.message || 'Error saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Cancel editing? Changes will be lost.')) {
      setCounts(EMPTY_COUNTS);
      setCloser('');
      setSaveStatus('');
      setIsEditMode(false);
      setEditingId(null);
      navigate('/logs');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;
    doc.setFontSize(18); doc.setFont(undefined, 'bold');
    doc.text('Register Closing Report', pageWidth / 2, y, { align: 'center' }); y += 10;
    doc.setFontSize(10); doc.setFont(undefined, 'normal');
    doc.text(`Date: ${new Date().toLocaleString()}`, pageWidth / 2, y, { align: 'center' }); y += 5;
    doc.text(`Closer: ${closer || 'N/A'}`, pageWidth / 2, y, { align: 'center' }); y += 15;
    doc.setFontSize(13); doc.setFont(undefined, 'bold');
    doc.text('Cash Count', 14, y); y += 8;
    doc.setFontSize(10); doc.setFont(undefined, 'normal');
    DENOMINATIONS.forEach(({ label, key, unit }) => {
      const count = parseInt(counts[key]) || 0;
      if (count > 0) { doc.text(`${label}: ${count} × ${$$(unit)} = ${$$(count * unit)}`, 20, y); y += 5; }
    });
    y += 5;
    doc.setFontSize(13); doc.setFont(undefined, 'bold');
    doc.text('Summary', 14, y); y += 8;
    doc.setFontSize(10); doc.setFont(undefined, 'normal');
    doc.text(`Drawer Total: ${$$(total)}`, 20, y); y += 6;
    doc.text(`Deposit: ${$$(deposit)}`, 20, y); y += 6;
    doc.text(`Safe: ${$$(safe)}`, 20, y); y += 10;
    doc.setFontSize(13); doc.setFont(undefined, 'bold');
    doc.text('Closing Instructions', 14, y); y += 8;
    doc.setFontSize(10); doc.setFont(undefined, 'normal');
    steps.forEach(line => { if (y > 270) { doc.addPage(); y = 20; } doc.text(line, 20, y); y += 5; });
    doc.save(`closing-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const saveBtn = {
    active: closer.trim() && total > 0,
    label: isSaving ? 'Saving…' : savedFlash ? 'Closing Saved' : isEditMode ? 'Update Closing' : 'Save Closing',
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE]" style={{ fontFamily: serif }}>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 pb-28 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-10 lg:gap-14">

          {/* ── Left: ledger form ───────────────────────────────────── */}
          <div>
            <div className="mb-7 sm:mb-9">
              <h2
                className="text-[28px] sm:text-[34px] leading-tight text-[#111]"
                style={{ fontFamily: serif, letterSpacing: '-0.01em' }}
              >
                {isEditMode ? 'Edit Closing' : 'Register Closing'}
              </h2>
              <p className="text-[13px] sm:text-[14px] text-[#8a8378] italic mt-1.5" style={{ fontFamily: serif }}>
                Enter denomination counts to calculate your totals.
              </p>
              {isEditMode && (
                <div
                  className="mt-3 inline-block text-[10px] uppercase tracking-[0.15em] text-[#8a8378] border border-black/15 px-3 py-1"
                  style={{ fontFamily: serif }}
                >
                  Edit Mode
                </div>
              )}
            </div>

            {/* Closer name */}
            <div className="mb-7 sm:mb-8 pb-6 sm:pb-7 border-b border-black/[0.08]">
              <label className="block text-[10px] uppercase tracking-[0.22em] text-[#8a8378] mb-3" style={{ fontFamily: serif }}>
                Closer Name
              </label>
              <input
                type="text"
                value={closer}
                onChange={e => setCloser(e.target.value)}
                placeholder="Enter your name"
                className="w-full text-[15px] sm:text-[17px] italic bg-transparent border-0 border-b border-black/[0.18] focus:border-black focus:outline-none pb-1.5 transition-colors duration-150 placeholder-black/20 text-[#111]"
                style={{ fontFamily: serif }}
              />
            </div>

            {/* Column headers */}
            <div
              className="grid items-center pb-2"
              style={{ gridTemplateColumns: '1fr auto 72px', gap: '8px' }}
            >
              {['Denomination', 'Qty', 'Amount'].map((h, i) => (
                <span
                  key={h}
                  className={`text-[10px] uppercase tracking-[0.2em] text-[#8a8378] ${i === 2 ? 'text-right' : i === 1 ? 'text-center' : ''}`}
                  style={{ fontFamily: serif }}
                >
                  {h}
                </span>
              ))}
            </div>
            <div className="h-px bg-black/15" />

            {['Bills', 'Loose Coins', 'Coin Rolls'].map(section => (
              <LedgerSection key={section} title={section}>
                {DENOMINATIONS.filter(d => d.section === section).map(({ key, label, unit }) => (
                  <DRow
                    key={key}
                    label={label}
                    unit={unit}
                    count={counts[key]}
                    onChange={v => handleCountChange(key, v)}
                  />
                ))}
              </LedgerSection>
            ))}

            {/* Actions */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-7 border-t border-black/[0.08] flex flex-wrap items-center gap-3 sm:gap-4">
              {isEditMode && (
                <button
                  onClick={handleCancel}
                  className="px-5 sm:px-6 py-2.5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] border border-black/20 text-[#8a8378] hover:border-black hover:text-[#111] active:opacity-60 transition-colors"
                  style={{ fontFamily: serif, borderRadius: '1px' }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={generatePDF}
                disabled={total === 0}
                className="px-5 sm:px-6 py-2.5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] border border-black/20 text-[#8a8378] hover:border-black hover:text-[#111] active:opacity-60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ fontFamily: serif, borderRadius: '1px' }}
              >
                PDF
              </button>
              <button
                onClick={logRegisterClosing}
                disabled={isSaving || !closer.trim() || total === 0}
                className="px-6 sm:px-8 py-2.5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed"
                style={{
                  fontFamily: serif,
                  background: savedFlash ? '#333' : saveBtn.active ? '#111' : '#c9c5be',
                  color: saveBtn.active ? '#F7F4EE' : '#8a8378',
                  borderRadius: '1px',
                }}
              >
                {saveBtn.label}
              </button>
              {saveStatus && !savedFlash && (
                <p className="w-full text-[12px] italic text-[#8a8378]" style={{ fontFamily: serif }}>
                  {saveStatus}
                </p>
              )}
            </div>
          </div>

          {/* ── Right: summary panel (desktop sidebar) ──────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-[85px]">
              <SummaryPanel total={total} deposit={deposit} safe={safe} steps={steps} />
            </div>
          </div>

          {/* ── Mobile: full summary panel inline below the form ─────── */}
          <div className="lg:hidden">
            <SummaryPanel total={total} deposit={deposit} safe={safe} steps={steps} />
          </div>
        </div>
      </main>

      {/* ── Mobile sticky bottom summary bar ─────────────────────── */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-black/[0.09] z-30"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="px-5 py-3 flex items-center justify-between gap-4">
          <div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-[#8a8378] mb-0.5" style={{ fontFamily: serif }}>
              Total
            </div>
            <div className="text-[22px] leading-none text-[#111]" style={{ fontFamily: mono, letterSpacing: '-0.02em' }}>
              {$$(total)}
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-[0.15em] text-[#8a8378] mb-0.5" style={{ fontFamily: serif }}>
                Deposit
              </div>
              <div className="text-[15px] leading-none text-[#111]" style={{ fontFamily: mono }}>
                {$$(deposit)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-[0.15em] text-[#8a8378] mb-0.5" style={{ fontFamily: serif }}>
                Safe
              </div>
              <div className="text-[15px] leading-none text-[#8a8378]" style={{ fontFamily: mono }}>
                {$$(safe)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer — desktop only */}
      <footer className="hidden lg:block mx-auto max-w-5xl px-6 py-8 mt-6">
        <div className="h-px bg-black/[0.07] mb-5" />
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

// ─── Summary Panel (desktop sidebar) ─────────────────────────────────────────

function SummaryPanel({ total, deposit, safe, steps }) {
  return (
    <div className="bg-white border border-black/[0.09]" style={{ borderRadius: '1px' }}>
      <div className="px-6 py-4 border-b border-black/[0.07]">
        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8a8378]" style={{ fontFamily: serif }}>
          Summary
        </span>
      </div>

      <div className="px-6 py-7 border-b border-black/[0.07]">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#8a8378] mb-3" style={{ fontFamily: serif }}>
          Drawer Total
        </div>
        <div className="text-[44px] text-[#111] leading-none" style={{ fontFamily: mono, letterSpacing: '-0.03em' }}>
          {$$(total)}
        </div>
        {total > 0 && (
          <p className="text-[11px] italic text-[#8a8378] mt-2.5" style={{ fontFamily: serif }}>
            {total >= 200 ? 'Deposit required' : 'Under base — no deposit needed'}
          </p>
        )}
      </div>

      <div className="px-6 py-6 border-b border-black/[0.07]">
        <div className="grid grid-cols-2 gap-6">
          {[{ label: 'Deposit', value: deposit, sub: 'to envelope' }, { label: 'Safe', value: safe, sub: 'stays in drawer' }].map(({ label, value, sub }) => (
            <div key={label}>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#8a8378] mb-2" style={{ fontFamily: serif }}>
                {label}
              </div>
              <div className="text-[22px] text-[#111] leading-none" style={{ fontFamily: mono }}>
                {$$(value)}
              </div>
              <div className="text-[10px] italic text-[#8a8378] mt-1.5" style={{ fontFamily: serif }}>
                {sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#8a8378] mb-4" style={{ fontFamily: serif }}>
          Closing Instructions
        </div>
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-[11px] italic text-[#8a8378] mt-0.5 leading-none min-w-[16px]" style={{ fontFamily: serif }}>
                {i + 1}.
              </span>
              <span className="text-[12px] text-[#2a2a2a] leading-snug" style={{ fontFamily: mono }}>
                {s}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Closing;
