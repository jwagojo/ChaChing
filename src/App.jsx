import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Closing from './pages/Closing';
import Logs from './pages/Logs';
import Login from './pages/Login';

function ProtectedRoute({ children }) {
  const { location: appLocation } = useAuth();
  const routerLocation = useLocation();

  if (!appLocation) {
    return <Navigate to="/login" state={{ from: routerLocation }} replace />;
  }

  return children;
}

function AppRoutes() {
  const { location: appLocation } = useAuth();

  return (
    <>
      {appLocation && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={appLocation ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/closing" element={<ProtectedRoute><Closing /></ProtectedRoute>} />
        <Route path="/logs" element={<ProtectedRoute><Logs /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/closing" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#F7F4EE]">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
