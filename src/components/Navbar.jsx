import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-orange-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-white text-xl font-bold">
            ChaChing
          </Link>
          <div className="flex space-x-8">
            <Link to="/" className="text-white hover:text-orange-200 transition-colors">
              Home
            </Link>
            <Link to="/logs" className="text-white hover:text-orange-200 transition-colors">
                Logs
            </Link>
            <Link to="/contact" className="text-white hover:text-orange-200 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
