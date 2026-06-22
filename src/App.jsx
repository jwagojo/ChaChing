import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Closing from './pages/Closing';
import Logs from './pages/Logs';
import Login from './pages/Login';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] } },
};

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

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
  const location = useLocation();

  return (
    <>
      {appLocation && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/login"
            element={
              <PageWrapper>
                {appLocation ? <Navigate to="/" replace /> : <Login />}
              </PageWrapper>
            }
          />
          <Route path="/" element={<ProtectedRoute><PageWrapper><Home /></PageWrapper></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><PageWrapper><About /></PageWrapper></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><PageWrapper><Services /></PageWrapper></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><PageWrapper><Contact /></PageWrapper></ProtectedRoute>} />
          <Route path="/closing" element={<ProtectedRoute><PageWrapper><Closing /></PageWrapper></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute><PageWrapper><Logs /></PageWrapper></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/closing" replace />} />
        </Routes>
      </AnimatePresence>
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
