import React, { useState } from 'react';
import Router from './router'


function App() {
  const [user, setUser] = useState();

  return (
    <Router user={user} setUser={setUser}/>
  );
}

export default App;


