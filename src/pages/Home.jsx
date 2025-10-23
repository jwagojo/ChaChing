import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-white-500 animate-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="dollar-sign">$</div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6">Welcome to ChaChing</h1>
          <p className="text-xl mb-8">Need to close register?</p>
          <Link 
            to="/closing" 
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Closing
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="dollar-sign-white">$</div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Count Cash</h3>
            <p className="text-gray-600">Enter the amount of bills and coins in your register</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Calculate Split</h3>
            <p className="text-gray-600">Algorithm determines revenue vs safe allocation automatically</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Log Calculations</h3>
            <p className="text-gray-600">Store and track all your register closing calculations</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
