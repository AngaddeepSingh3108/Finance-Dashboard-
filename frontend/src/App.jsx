import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('finance_user_react');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('finance_user_react', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('finance_user_react');
  };

  return (
    <>
      {user ? <Dashboard user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
    </>
  );
}

export default App;
