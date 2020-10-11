import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

import MainMenu from './pages/MainMenu/MainMenu';
import GamePage from './pages/GamePage/GamePage';
import LoginPage from './pages/LoginPage/LoginPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/game/:gameId" component={GamePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/" component={MainMenu} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
