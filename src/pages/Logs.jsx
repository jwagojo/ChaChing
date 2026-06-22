import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logService } from '../services/logService';
import { Trash2, Archive } from 'lucide-react';
import jsPDF from 'jspdf';

const serif = '"Times New Roman", Times, Georgia, serif';
const mono  = '"Courier New", Courier, monospace';

const $$ = (n) => Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const fmtDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function Logs() {
  const navigate = useNavigate();
  const [closings, setClosings] = useState([]);
  const [filterCloser, setFilterCloser] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadClosings(); }, [selectedDate]);

  const loadClosings = async () => {
    setLoading(true);
    try {
      const data = selectedDate
        ? await logService.getLogsByDate(selectedDate)
        : await logService.getAllLogs();
      setClosings(data);
    } catch (error) {
      console.error('Error loading closings:', error);
      alert('Error loading data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (closing) => {
    navigate('/closing', { state: { editingLog: closing } });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this closing log?')) return;
    try {
      await logService.deleteLog(id);
      loadClosings();
    } catch (error) {
      console.error('Error deleting log:', error);
      alert('Failed to delete log');
    }
  };

  const generatePDF = (closing) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;
    doc.setFontSize(18); doc.setFont(undefined, 'bold');
    doc.text('Register Closing Report', pageWidth / 2, y, { align: 'center' }); y += 10;
    doc.setFontSize(10); doc.setFont(undefined, 'normal');
    doc.text(`Date: ${new Date(closing.timestamp).toLocaleString()}`, pageWidth / 2, y, { align: 'center' }); y += 5;
    doc.text(`Closer: ${closing.closer}`, pageWidth / 2, y, { align: 'center' }); y += 15;
    doc.setFontSize(12); doc.setFont(undefined, 'bold');
    doc.text('Summary', 14, y); y += 8;
    doc.setFontSize(10); doc.setFont(undefined, 'normal');
    doc.text(`Total: ${$$(closing.totalAmount)}`, 20, y); y += 6;
    doc.text(`Deposit: ${$$(closing.revenueAmount)}`, 20, y); y += 6;
    doc.text(`Safe: ${$$(closing.safeAmount)}`, 20, y);
    doc.save(`closing-${closing.closer}-${new Date(closing.timestamp).toISOString().split('T')[0]}.pdf`);
  };

  const filteredClosings = closings.filter(c =>
    !filterCloser || c.closer.toLowerCase().includes(filterCloser.toLowerCase())
  );

  const totalDeposit = filteredClosings.reduce((s, l) => s + (l.revenueAmount || 0), 0);
  const totalGross   = filteredClosings.reduce((s, l) => s + (l.totalAmount   || 0), 0);

  return (
    <div className="min-h-screen bg-[#F7F4EE]" style={{ fontFamily: serif }}>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">

        {/* Page title + filter */}
        <div className="flex flex-col gap-5 mb-8 sm:mb-10 pb-5 sm:pb-6 border-b border-black/[0.08]">
          <div>
            <h2
              className="text-[28px] sm:text-[34px] leading-tight text-[#111]"
              style={{ fontFamily: serif, letterSpacing: '-0.01em' }}
            >
              Closing Logs
            </h2>
            <p className="text-[13px] italic text-[#8a8378] mt-1" style={{ fontFamily: serif }}>
              {filteredClosings.length} {filteredClosings.length === 1 ? 'entry' : 'entries'} on record
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.18em] text-[#8a8378] mb-2" style={{ fontFamily: serif }}>
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto text-[13px] bg-transparent border-0 border-b border-black/20 focus:border-black focus:outline-none pb-1.5 text-[#111] transition-colors"
                style={{ fontFamily: serif }}
              />
            </div>
            <input
              type="text"
              placeholder="Filter by name…"
              value={filterCloser}
              onChange={e => setFilterCloser(e.target.value)}
              className="text-[13px] italic bg-transparent border-0 border-b border-black/20 focus:border-black focus:outline-none pb-1.5 transition-colors duration-150 placeholder-black/25 text-[#111]"
              style={{ fontFamily: serif }}
            />
            {(selectedDate || filterCloser) && (
              <button
                onClick={() => { setSelectedDate(''); setFilterCloser(''); }}
                className="self-start sm:self-auto text-[11px] uppercase tracking-[0.15em] text-[#8a8378] hover:text-[#111] active:opacity-60 transition-colors"
                style={{ fontFamily: serif }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-6 h-6 border border-black/20 border-t-black/60 rounded-full animate-spin mx-auto" />
            <p className="text-[13px] italic text-[#8a8378] mt-4" style={{ fontFamily: serif }}>Loading…</p>
          </div>
        ) : filteredClosings.length === 0 ? (
          <div className="py-20 sm:py-24 text-center border-t border-b border-black/[0.07]">
            <Archive size={20} className="mx-auto mb-4 text-black/15" />
            <p className="text-[15px] sm:text-[16px] italic text-[#8a8378]" style={{ fontFamily: serif }}>
              {filterCloser || selectedDate ? 'No entries match your filter.' : 'No closings have been logged yet.'}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-black/[0.09] overflow-hidden" style={{ borderRadius: '1px' }}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-black/10">
                    {['Date', 'Closer', 'Total', 'Deposit', 'Safe', ''].map((col, i) => (
                      <th
                        key={i}
                        className={`px-3 sm:px-5 py-3 sm:py-4 text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.18em] text-[#8a8378] font-normal whitespace-nowrap ${i >= 2 && i < 5 ? 'text-right' : 'text-left'}`}
                        style={{ fontFamily: serif }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredClosings.map(log => (
                    <tr key={log.id} className="border-b border-black/[0.05] last:border-0 hover:bg-[#F7F4EE]/60 transition-colors group">
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-[11px] sm:text-[12px] italic text-[#8a8378] whitespace-nowrap" style={{ fontFamily: serif }}>
                        {log.timestamp ? fmtDate(new Date(log.timestamp).toISOString().split('T')[0]) : log.date}
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-[13px] sm:text-[14px] text-[#111]" style={{ fontFamily: serif }}>
                        {log.closer}
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-right text-[13px] sm:text-[14px] text-[#111] whitespace-nowrap" style={{ fontFamily: mono }}>
                        {$$(log.totalAmount)}
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-right text-[12px] sm:text-[13px] text-[#2a2a2a] whitespace-nowrap" style={{ fontFamily: mono }}>
                        {$$(log.revenueAmount)}
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-right text-[12px] sm:text-[13px] text-[#8a8378] whitespace-nowrap" style={{ fontFamily: mono }}>
                        {$$(log.safeAmount)}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-right">
                        <div className="flex items-center justify-end gap-2 sm:gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => generatePDF(log)}
                            className="text-[10px] uppercase tracking-[0.1em] text-[#8a8378] hover:text-[#111] active:opacity-60 transition-colors hidden sm:inline"
                            style={{ fontFamily: serif }}
                          >
                            PDF
                          </button>
                          <button
                            onClick={() => handleEdit(log)}
                            className="text-[10px] uppercase tracking-[0.1em] text-[#8a8378] hover:text-[#111] active:opacity-60 transition-colors hidden sm:inline"
                            style={{ fontFamily: serif }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(log.id)}
                            className="text-black/25 hover:text-[#991b1b] active:opacity-60 transition-colors p-1"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="border-t border-black/[0.07] px-3 sm:px-5 py-3 sm:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 bg-[#F7F4EE]/40">
              <span className="text-[11px] italic text-[#8a8378]" style={{ fontFamily: serif }}>
                {filteredClosings.length} closings shown
              </span>
              <div className="flex items-center gap-4 sm:gap-7">
                <span className="text-[11px] text-[#8a8378]" style={{ fontFamily: serif }}>
                  Deposited:{' '}
                  <span style={{ fontFamily: mono, color: '#111' }}>{$$(totalDeposit)}</span>
                </span>
                <span className="text-[11px] text-[#8a8378]" style={{ fontFamily: serif }}>
                  Gross:{' '}
                  <span style={{ fontFamily: mono, color: '#111' }}>{$$(totalGross)}</span>
                </span>
              </div>
            </div>
          </div>
        )}
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

export default Logs;
