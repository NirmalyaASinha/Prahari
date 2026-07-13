import React, { useState } from 'react';
import PrahariLogin from './components/PrahariLogin';
import PrahariDashboard from './components/PrahariDashboard';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialThreatActive, setInitialThreatActive] = useState(false);

  const handleLoginSuccess = (startWithThreat = false) => {
    setInitialThreatActive(startWithThreat);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <PrahariDashboard initialThreatActive={initialThreatActive} />
      ) : (
        <PrahariLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
