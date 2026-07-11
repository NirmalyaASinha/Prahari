import React, { useState } from 'react';
import PrahariLogin from './components/PrahariLogin';
import PrahariDashboard from './components/PrahariDashboard';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      {isLoggedIn ? (
        <PrahariDashboard />
      ) : (
        <PrahariLogin onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;
