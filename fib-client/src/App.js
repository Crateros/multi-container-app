import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

// Components
import { AlternatePage } from './pages/alternatePage';
import { FibCalc } from './pages/fibCalc';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Donnie's Docker App</h1>
          <Link to="/fibcalc">Fibonacci Calculator</Link>
          <Link to="/alternate">Alternate Page</Link>
          <div>
            <Route path="/fibcalc" component={FibCalc} />
            <Route path="/alternate" component={AlternatePage} />
          </div>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </Router>
  );
}

export default App;
