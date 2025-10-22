import { useState } from 'react';

function Closing() {
  const [counts, setCounts] = useState({
    // Bills
    hundreds: 0,
    fifties: 0,
    twenties: 0,
    tens: 0,
    fives: 0,
    ones: 0,
    // Coins
    quarters: 0,
    dimes: 0,
    nickels: 0,
    pennies: 0
  });

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
    pennies: 0.01
  };

  const handleCountChange = (denomination, value) => {
    setCounts(prev => ({
      ...prev,
      [denomination]: Math.max(0, parseInt(value) || 0)
    }));
  };

  const calculateTotal = () => {
    return Object.entries(counts).reduce((total, [denom, count]) => {
      return total + (count * denominations[denom]);
    }, 0);
  };

  const calculateSplit = (total) => {
    // Mock algorithm - keep $100 base + 10% for safe, rest for revenue
    const safeAmount = Math.max(100, total * 0.1);
    const revenueAmount = Math.max(0, total - safeAmount);
    return { safeAmount, revenueAmount };
  };

  const total = calculateTotal();
  const { safeAmount, revenueAmount } = calculateSplit(total);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Register Closing Calculator</h1>
        <p className="text-xl text-gray-600">Count your cash and let us handle the split</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Count Your Cash</h2>
          
          {/* Bills */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Bills</h3>
            <div className="space-y-3">
              {[
                { key: 'hundreds', label: '$100', color: 'bg-green-100' },
                { key: 'fifties', label: '$50', color: 'bg-blue-100' },
                { key: 'twenties', label: '$20', color: 'bg-yellow-100' },
                { key: 'tens', label: '$10', color: 'bg-red-100' },
                { key: 'fives', label: '$5', color: 'bg-purple-100' },
                { key: 'ones', label: '$1', color: 'bg-gray-100' }
              ].map(({ key, label, color }) => (
                <div key={key} className={`flex items-center justify-between p-3 rounded-lg ${color}`}>
                  <span className="font-medium">{label}</span>
                  <input
                    type="number"
                    min="0"
                    value={counts[key]}
                    onChange={(e) => handleCountChange(key, e.target.value)}
                    className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Coins */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-700">Coins</h3>
            <div className="space-y-3">
              {[
                { key: 'quarters', label: '$0.25', color: 'bg-orange-100' },
                { key: 'dimes', label: '$0.10', color: 'bg-pink-100' },
                { key: 'nickels', label: '$0.05', color: 'bg-indigo-100' },
                { key: 'pennies', label: '$0.01', color: 'bg-amber-100' }
              ].map(({ key, label, color }) => (
                <div key={key} className={`flex items-center justify-between p-3 rounded-lg ${color}`}>
                  <span className="font-medium">{label}</span>
                  <input
                    type="number"
                    min="0"
                    value={counts[key]}
                    onChange={(e) => handleCountChange(key, e.target.value)}
                    className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Calculation Results</h2>
          
          <div className="space-y-6">
            {/* Total */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Total Cash Count</h3>
              <p className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</p>
            </div>

            {/* Split */}
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <h3 className="text-lg font-medium text-green-800 mb-1">Revenue Deposit</h3>
                <p className="text-2xl font-bold text-green-700">${revenueAmount.toFixed(2)}</p>
                <p className="text-sm text-green-600 mt-1">Amount to deposit for revenue</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="text-lg font-medium text-blue-800 mb-1">Safe Storage</h3>
                <p className="text-2xl font-bold text-blue-700">${safeAmount.toFixed(2)}</p>
                <p className="text-sm text-blue-600 mt-1">Amount to keep in safe</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                Save Calculation
              </button>
              <button 
                onClick={() => setCounts({
                  hundreds: 0, fifties: 0, twenties: 0, tens: 0, fives: 0, ones: 0,
                  quarters: 0, dimes: 0, nickels: 0, pennies: 0
                })}
                className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Closing;
