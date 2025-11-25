import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logService } from '../services/logService';
import jsPDF from 'jspdf';

function Logs() {
  const navigate = useNavigate();
  const [closings, setClosings] = useState([]);
  const [filterCloser, setFilterCloser] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClosings();
  }, [selectedDate]);

  const loadClosings = async () => {
    setLoading(true);
    try {
      let data;
      if (selectedDate) {
        data = await logService.getLogsByDate(selectedDate);
      } else {
        data = await logService.getAllLogs();
      }
      setClosings(data);
    } catch (error) {
      console.error('Error loading closings:', error);
      alert('Error loading data. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (closing) => {
    // Navigate to closing page with the log data
    navigate('/closing', { state: { editingLog: closing } });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this log?')) return;
    
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
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Register Closing Report', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Date: ${new Date(closing.timestamp).toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
    doc.text(`Closer: ${closing.closer}`, pageWidth / 2, yPosition + 5, { align: 'center' });

    yPosition += 20;
    
    // Cash Count Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Cash Count Breakdown', 14, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const denominations = {
      hundreds: 100, fifties: 50, twenties: 20, tens: 10, fives: 5, ones: 1,
      quarters: 0.25, dimes: 0.10, nickels: 0.05, pennies: 0.01,
      quarterRolls: 10.00, dimeRolls: 5.00, nickelRolls: 2.00, pennyRolls: 0.50
    };
    
    // Bills
    doc.setFont(undefined, 'bold');
    doc.text('Bills:', 14, yPosition);
    yPosition += 5;
    doc.setFont(undefined, 'normal');
    
    const billData = [
      { label: '$100 Bills', key: 'hundreds', value: 100 },
      { label: '$50 Bills', key: 'fifties', value: 50 },
      { label: '$20 Bills', key: 'twenties', value: 20 },
      { label: '$10 Bills', key: 'tens', value: 10 },
      { label: '$5 Bills', key: 'fives', value: 5 },
      { label: '$1 Bills', key: 'ones', value: 1 }
    ];

    billData.forEach(({ label, key, value }) => {
      const count = parseInt(closing.counts[key]) || 0;
      const subtotal = (count * value).toFixed(2);
      doc.text(`${label}: ${count} × $${value.toFixed(2)} = $${subtotal}`, 20, yPosition);
      yPosition += 5;
    });

    yPosition += 3;
    
    // Coins
    doc.setFont(undefined, 'bold');
    doc.text('Coins:', 14, yPosition);
    yPosition += 5;
    doc.setFont(undefined, 'normal');
    
    const coinData = [
      { label: 'Quarters', key: 'quarters', value: 0.25 },
      { label: 'Dimes', key: 'dimes', value: 0.10 },
      { label: 'Nickels', key: 'nickels', value: 0.05 },
      { label: 'Pennies', key: 'pennies', value: 0.01 }
    ];

    coinData.forEach(({ label, key, value }) => {
      const count = parseInt(closing.counts[key]) || 0;
      const subtotal = (count * value).toFixed(2);
      doc.text(`${label}: ${count} × $${value.toFixed(2)} = $${subtotal}`, 20, yPosition);
      yPosition += 5;
    });

    yPosition += 3;
    
    // Rolls
    doc.setFont(undefined, 'bold');
    doc.text('Rolls:', 14, yPosition);
    yPosition += 5;
    doc.setFont(undefined, 'normal');
    
    const rollData = [
      { label: 'Quarter Rolls', key: 'quarterRolls', value: 10.00 },
      { label: 'Dime Rolls', key: 'dimeRolls', value: 5.00 },
      { label: 'Nickel Rolls', key: 'nickelRolls', value: 2.00 },
      { label: 'Penny Rolls', key: 'pennyRolls', value: 0.50 }
    ];

    rollData.forEach(({ label, key, value }) => {
      const count = parseInt(closing.counts[key]) || 0;
      const subtotal = (count * value).toFixed(2);
      doc.text(`${label}: ${count} × $${value.toFixed(2)} = $${subtotal}`, 20, yPosition);
      yPosition += 5;
    });

    yPosition += 8;
    
    // Summary Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Summary', 14, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.text(`Total Cash Count: $${closing.totalAmount.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Revenue Deposit: $${closing.revenueAmount.toFixed(2)}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Safe Storage: $${closing.safeAmount.toFixed(2)}`, 20, yPosition);
    yPosition += 10;

    // Closing Instructions
    if (closing.closingInstructions) {
      doc.setFontSize(14);
      doc.text('Closing Instructions', 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const instructions = closing.closingInstructions.split('\n');
      instructions.forEach(line => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 5;
      });
    }

    // Save PDF
    const fileName = `closing-${closing.closer}-${new Date(closing.timestamp).toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const filteredClosings = filterCloser
    ? closings.filter(closing =>
        closing.closer.toLowerCase().includes(filterCloser.toLowerCase())
      )
    : closings;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Closing Logs</h1>
        <p className="text-xl text-gray-600">
          Track all your register closing calculations and history
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Closer</label>
            <input
              type="text"
              placeholder="Enter closer name..."
              value={filterCloser}
              onChange={(e) => setFilterCloser(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedDate('');
                setFilterCloser('');
              }}
              className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading logs...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {filteredClosings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Total Cash</th>
                    <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Safe</th>
                    <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClosings.map((closing) => (
                    <tr key={closing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(closing.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(closing.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${closing.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        ${closing.revenueAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        ${closing.safeAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {closing.closer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => generatePDF(closing)}
                            className="text-purple-600 hover:text-purple-800"
                            title="Download PDF"
                          >
                            📄 PDF
                          </button>
                          <button
                            onClick={() => handleEdit(closing)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(closing.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No register closings found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Logs;
