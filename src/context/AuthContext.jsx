import { createContext, useContext, useState } from 'react';

const LOCATIONS = {
  lowell: 'Lowell',
  dorchester: 'Dorchester',
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [location, setLocationState] = useState(
    () => localStorage.getItem('chaching-location')
  );

  function selectLocation(loc) {
    if (!LOCATIONS[loc]) throw new Error('Invalid location');
    localStorage.setItem('chaching-location', loc);
    setLocationState(loc);
  }

  function clearLocation() {
    localStorage.removeItem('chaching-location');
    setLocationState(null);
  }

  function getLocation() {
    return location;
  }

  function getLocationLabel() {
    return LOCATIONS[location] ?? null;
  }

  return (
    <AuthContext.Provider value={{ location, selectLocation, clearLocation, getLocation, getLocationLabel }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
