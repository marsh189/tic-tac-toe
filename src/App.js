import React, { useState } from 'react';
import './index.css';
import Board from './components/Board';
import Login from './components/Login';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState('');
  return (
    <div className="App">
      {isAuth ? (
        <Board setIsAuth={setIsAuth} setUser={setUser} user={user} />
      ) : (
        <Login setIsAuth={setIsAuth} setUser={setUser} user={user} />
      )}
    </div>
  );
}
export default App;
