import { useState, useEffect } from 'react';

function Closing() {
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

      for (let i = 5; i >= 4; i--) {
        const bills = Math.min(Math.floor(revenue / money[i].value), moneyAmount[i].count || 0);
        revenue -= bills * money[i].value;
        moneyInEnvelope += bills * money[i].value;
        if (bills !== 0) {
          text += `$${money[i].value}: ${bills}\n`;
        }
      }

      for (let i = 3; i >= 0; i--) {
        if (revenue > 4) {
          const bills = Math.min(Math.floor(revenue / money[i].value), Math.max(0, (moneyAmount[i].count) - 1));
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 relative overflow-hidden">

      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="dollar-sign-white">$</div>
        ))}
      </div>

      <div className="text-center mb-12 relative z-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Register Closing Calculator</h1>
        <p className="text-xl text-gray-600">Count your cash and let us handle the split</p>
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
              <button 
                onClick={() => {
                  setCounts({
                    hundreds: '', fifties: '', twenties: '', tens: '', fives: '', ones: '',
                    quarters: '', dimes: '', nickels: '', pennies: '',
                    quarterRolls: '', dimeRolls: '', nickelRolls: '', pennyRolls: ''
                  });
                  setClosingResult('');
                }}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Log Register Closing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Closing;
