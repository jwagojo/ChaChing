function Logs() {
  
  const mockLogs = [
    {
      id: 1,
      date: "2024-01-15",
      time: "9:30 PM",
      totalCash: "$1,247.50",
      revenue: "$1,150.00",
      safe: "$97.50",
      employee: "John Doe"
    },
    {
      id: 2,
      date: "2024-01-14",
      time: "9:45 PM", 
      totalCash: "$987.25",
      revenue: "$890.00",
      safe: "$97.25",
      employee: "Jane Smith"
    },
    {
      id: 3,
      date: "2024-01-13",
      time: "9:15 PM",
      totalCash: "$1,456.75",
      revenue: "$1,350.00",
      safe: "$106.75",
      employee: "Mike Johnson"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Closing Logs</h1>
        <p className="text-xl text-gray-600">
          Track all your register closing calculations and history
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.totalCash}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{log.revenue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{log.safe}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.employee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Logs;
