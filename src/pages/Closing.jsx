import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logService } from '../services/logService';
import jsPDF from 'jspdf';

function Closing() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingLog = location.state?.editingLog;

  const [counts, setCounts] = useState({
    // Bills
    hundreds: '',
    fifties: '',
    twenties: '',
    tens: '',
    fives: '',
    ones: '',
    // Coins
    quarters: '',
    dimes: '',
    nickels: '',
    pennies: '',
    // Rolls
    quarterRolls: '',
    dimeRolls: '',
    nickelRolls: '',
    pennyRolls: ''
  });

  const [closingResult, setClosingResult] = useState('');
  const [closer, setCloser] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Load editing data if present
  useEffect(() => {
    if (editingLog) {
      setIsEditMode(true);
      setEditingId(editingLog.id);
      setCloser(editingLog.closer);
      setCounts(editingLog.counts);
      // The closeRegister will be triggered by the counts useEffect
    }
  }, [editingLog]);

  const denominations = {
    hundreds: 100,
    fifties: 50,
    twenties: 20,
    tens: 10,
    fives: 5,
    ones: 1,
    quarters: 0.25,
    dimes: 0.10,
    nickels: 0.05,
    pennies: 0.01,
    quarterRolls: 10.00,
    dimeRolls: 5.00,
    nickelRolls: 2.00,
    pennyRolls: 0.50
  };

  const handleCountChange = (denomination, value) => {
    setCounts(prev => ({
      ...prev,
      [denomination]: value === '' ? '' : Math.max(0, parseInt(value) || 0).toString()
    }));
  };

  const calculateTotal = () => {
    return Object.entries(counts).reduce((total, [denom, count]) => {
      const numCount = parseInt(count) || 0;
      return total + (numCount * denominations[denom]);
    }, 0);
  };

  const calculateSplit = (total) => {
    // Mock algorithm - keep $100 base + 10% for safe, rest for revenue
    const safeAmount = Math.max(100, total * 0.1);
    const revenueAmount = Math.max(0, total - safeAmount);
    return { safeAmount, revenueAmount };
  };

  const closeRegister = () => {
    const total = calculateTotal();
    
    if (total > 200) {
      let revenue = Math.floor(total - 200);
      let text = "Bills in the envelope:\n";
      let moneyInEnvelope = 0.00;
      
      const money = [
        { value: 1 }, { value: 5 }, { value: 10 }, { value: 20 }, { value: 50 }, { value: 100 }
      ];
      
      const moneyAmount = [
        { count: parseInt(counts.ones) || 0 },
        { count: parseInt(counts.fives) || 0 },
        { count: parseInt(counts.tens) || 0 },
        { count: parseInt(counts.twenties) || 0 },
        { count: parseInt(counts.fifties) || 0 },
        { count: parseInt(counts.hundreds) || 0 }
      ];

      // Start with largest bills (100s and 50s) - take all for envelope
      for (let i = 5; i >= 4; i--) {
        const bills = Math.min(Math.floor(revenue / money[i].value), moneyAmount[i].count || 0);
        revenue -= bills * money[i].value;
        moneyInEnvelope += bills * money[i].value;
        if (bills !== 0) {
          text += `$${money[i].value}: ${bills}\n`;
        }
      }

      // For smaller bills (20s, 10s, 5s, 1s) - keep at least 5 of each in register
      for (let i = 3; i >= 0; i--) {
        if (revenue > 0) {
          const billsToKeep = Math.min(5, moneyAmount[i].count);
          const availableBills = Math.max(0, moneyAmount[i].count - billsToKeep);
          const bills = Math.min(Math.floor(revenue / money[i].value), availableBills);
          revenue -= bills * money[i].value;
          moneyInEnvelope += bills * money[i].value;
          if (bills !== 0) {
            text += `$${money[i].value}: ${bills}\n`;
          }
        }
      }

      const moneyInRegister = (total - moneyInEnvelope).toFixed(2);
      text += `Money in envelope: $${moneyInEnvelope.toFixed(2)}\nMoney in register: $${moneyInRegister}`;
      setClosingResult(text);
    }
  };

  const logRegisterClosing = async () => {
    if (!closer.trim()) {
      setSaveStatus('Please enter your name as the closer.');
      return;
    }

    if (total === 0) {
      setSaveStatus('Please enter cash counts before logging.');
      return;
    }

    setIsSaving(true);
    setSaveStatus(isEditMode ? 'Updating...' : 'Saving...');

    try {
      const closingData = {
        closer: closer.trim(),
        counts,
        totalAmount: total,
        safeAmount,
        revenueAmount,
        closingInstructions: closingResult
      };

      if (isEditMode) {
        await logService.updateLog(editingId, closingData);
        setSaveStatus('Register closing updated successfully!');
      } else {
        await logService.saveLog(closingData);
        setSaveStatus('Register closing logged successfully!');
      }
      
      // Clear form and navigate back to logs after successful save
      setTimeout(() => {
        setCounts({
          hundreds: '', fifties: '', twenties: '', tens: '', fives: '', ones: '',
          quarters: '', dimes: '', nickels: '', pennies: '',
          quarterRolls: '', dimeRolls: '', nickelRolls: '', pennyRolls: ''
        });
        setClosingResult('');
        setCloser('');
        setSaveStatus('');
        setIsEditMode(false);
        setEditingId(null);
        navigate('/logs');
      }, 1500);

    } catch (error) {
      console.error('Error logging register closing:', error);
      setSaveStatus(error.message || 'Error saving register closing. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      setCounts({
        hundreds: '', fifties: '', twenties: '', tens: '', fives: '', ones: '',
        quarters: '', dimes: '', nickels: '', pennies: '',
        quarterRolls: '', dimeRolls: '', nickelRolls: '', pennyRolls: ''
      });
      setClosingResult('');
      setCloser('');
      setSaveStatus('');
      setIsEditMode(false);
      setEditingId(null);
      navigate('/logs');
    }
  };

  // Auto-update
  useEffect(() => {
    if (Object.values(counts).some(count => count !== '')) {
      closeRegister();
    } else {
      setClosingResult('');
    }
  }, [counts]);

  const total = calculateTotal();
  const { safeAmount, revenueAmount } = calculateSplit(total);

  const generatePDF = () => {
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
    doc.text(`Date: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
    doc.text(`Closer: ${closer || 'N/A'}`, pageWidth / 2, yPosition + 5, { align: 'center' });

    yPosition += 20;
    
    // Cash Count Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Cash Count Breakdown', 14, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    // Bills
    doc.setFont(undefined, 'bold');
    doc.text('Bills:', 14, yPosition);
    yPosition += 5;
    doc.setFont(undefined, 'normal');
    
    const billData = [
      { label: '$100 Bills', key: 'hundreds', value: denominations.hundreds },
      { label: '$50 Bills', key: 'fifties', value: denominations.fifties },
      { label: '$20 Bills', key: 'twenties', value: denominations.twenties },
      { label: '$10 Bills', key: 'tens', value: denominations.tens },
      { label: '$5 Bills', key: 'fives', value: denominations.fives },
      { label: '$1 Bills', key: 'ones', value: denominations.ones }
    ];

    billData.forEach(({ label, key, value }) => {
      const count = parseInt(counts[key]) || 0;
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
      { label: 'Quarters', key: 'quarters', value: denominations.quarters },
      { label: 'Dimes', key: 'dimes', value: denominations.dimes },
      { label: 'Nickels', key: 'nickels', value: denominations.nickels },
      { label: 'Pennies', key: 'pennies', value: denominations.pennies }
    ];

    coinData.forEach(({ label, key, value }) => {
      const count = parseInt(counts[key]) || 0;
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
      { label: 'Quarter Rolls', key: 'quarterRolls', value: denominations.quarterRolls },
      { label: 'Dime Rolls', key: 'dimeRolls', value: denominations.dimeRolls },
      { label: 'Nickel Rolls', key: 'nickelRolls', value: denominations.nickelRolls },
      { label: 'Penny Rolls', key: 'pennyRolls', value: denominations.pennyRolls }
    ];

    rollData.forEach(({ label, key, value }) => {
      const count = parseInt(counts[key]) || 0;
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
    doc.text(`Total Cash Count: $${total.toFixed(2)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Revenue Deposit: $${revenueAmount.toFixed(2)}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Safe Storage: $${safeAmount.toFixed(2)}`, 20, yPosition);
    yPosition += 10;

    // Closing Instructions
    if (closingResult) {
      doc.setFontSize(14);
      doc.text('Closing Instructions', 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const instructions = closingResult.split('\n');
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
    const fileName = `register-closing-${new Date().toISOString().split('T')[0]}-${Date.now()}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 relative overflow-hidden">

      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="dollar-sign-white">$</div>
        ))}
      </div>

      <div className="text-center relative z-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Edit Register Closing' : 'Register Closing Calculator'}
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          {isEditMode ? 'Update the register closing information' : 'Count your cash and let us handle the split'}
        </p>
        {isEditMode && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg inline-block mb-4">
            Editing mode - Make your changes and click Update
          </div>
        )}
      </div>

      <div className="space-y-8 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Count Your Cash</h2>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Closer:</label>
              <input
                type="text"
                value={closer}
                onChange={(e) => setCloser(e.target.value)}
                placeholder="Your name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Bills</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { key: 'hundreds', label: '$100', color: 'bg-gray-100' },
                { key: 'fifties', label: '$50', color: 'bg-gray-100' },
                { key: 'twenties', label: '$20', color: 'bg-gray-100' },
                { key: 'tens', label: '$10', color: 'bg-gray-100' },
                { key: 'fives', label: '$5', color: 'bg-gray-100' },
                { key: 'ones', label: '$1', color: 'bg-gray-100' }
              ].map(({ key, label, color }) => (
                <div key={key} className={`flex flex-col items-center p-3 rounded-lg ${color} border-2 border-gray-400 shadow-md hover:shadow-lg transition-shadow`} style={{borderImage: 'linear-gradient(45deg, #c0c0c0, #e6e6e6, #808080) 1'}}>
                  <span className="font-medium mb-2">{label}</span>
                  <input
                    type="number"
                    min="0"
                    value={counts[key]}
                    onChange={(e) => handleCountChange(key, e.target.value)}
                    placeholder="0"
                    className="w-16 px-2 py-1 border-2 border-gray-500 rounded text-center focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400 shadow-inner"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Coins</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: 'quarters', label: '$0.25', color: 'bg-gray-100' },
                { key: 'dimes', label: '$0.10', color: 'bg-gray-100' },
                { key: 'nickels', label: '$0.05', color: 'bg-gray-100' },
                { key: 'pennies', label: '$0.01', color: 'bg-gray-100' }
              ].map(({ key, label, color }) => (
                <div key={key} className={`flex flex-col items-center p-3 rounded-lg ${color} border-2 border-gray-400 shadow-md hover:shadow-lg transition-shadow`} style={{borderImage: 'linear-gradient(45deg, #c0c0c0, #e6e6e6, #808080) 1'}}>
                  <span className="font-medium mb-2">{label}</span>
                  <input
                    type="number"
                    min="0"
                    value={counts[key]}
                    onChange={(e) => handleCountChange(key, e.target.value)}
                    placeholder="0"
                    className="w-16 px-2 py-1 border-2 border-gray-500 rounded text-center focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400 shadow-inner"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-700">Rolls</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: 'quarterRolls', label: '$10.00', color: 'bg-gray-100' },
                { key: 'dimeRolls', label: '$5.00', color: 'bg-gray-100' },
                { key: 'nickelRolls', label: '$2.00', color: 'bg-gray-100' },
                { key: 'pennyRolls', label: '$0.50', color: 'bg-gray-100' }
              ].map(({ key, label, color }) => (
                <div key={key} className={`flex flex-col items-center p-3 rounded-lg ${color} border-2 border-gray-400 shadow-md hover:shadow-lg transition-shadow`} style={{borderImage: 'linear-gradient(45deg, #c0c0c0, #e6e6e6, #808080) 1'}}>
                  <span className="font-medium mb-2">{label}</span>
                  <input
                    type="number"
                    min="0"
                    value={counts[key]}
                    onChange={(e) => handleCountChange(key, e.target.value)}
                    placeholder="0"
                    className="w-16 px-2 py-1 border-2 border-gray-500 rounded text-center focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400 shadow-inner"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Calculation Results</h2>
          
          <div className="space-y-6">

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Total Cash Count</h3>
              <p className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</p>
            </div>

            {closingResult && (
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <h3 className="text-lg font-medium text-green-800 mb-2">Register Closing Instructions</h3>
                <pre className="text-sm text-green-700 whitespace-pre-line">{closingResult}</pre>
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                <h3 className="text-lg font-medium text-yellow-800 mb-1">Revenue Deposit</h3>
                <p className="text-2xl font-bold text-yellow-700">${revenueAmount.toFixed(2)}</p>
                <p className="text-sm text-yellow-600 mt-1">Amount to deposit for revenue</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="text-lg font-medium text-blue-800 mb-1">Safe Storage</h3>
                <p className="text-2xl font-bold text-blue-700">${safeAmount.toFixed(2)}</p>
                <p className="text-sm text-blue-600 mt-1">Amount to keep in safe</p>
              </div>
            </div>
            <div className="space-y-3 pt-4">
              {isEditMode && (
                <button 
                  onClick={handleCancel}
                  className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Cancel Editing
                </button>
              )}
              
              <button 
                onClick={generatePDF}
                disabled={total === 0}
                className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                📄 Download PDF Report
              </button>
              
              <button 
                onClick={() => {
                  setCounts({
                    hundreds: '', fifties: '', twenties: '', tens: '', fives: '', ones: '',
                    quarters: '', dimes: '', nickels: '', pennies: '',
                    quarterRolls: '', dimeRolls: '', nickelRolls: '', pennyRolls: ''
                  });
                  setClosingResult('');
                }}
                className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Clear All
              </button>
              
              {saveStatus && (
                <div className={`p-3 rounded-lg text-center ${
                  saveStatus.includes('Error') 
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : saveStatus.includes('successfully')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {saveStatus}
                </div>
              )}

              <button 
                onClick={logRegisterClosing}
                disabled={isSaving || !closer.trim() || total === 0}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSaving ? (isEditMode ? 'Updating...' : 'Logging...') : (isEditMode ? 'Update Register Closing' : 'Log Register Closing')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Closing;
