import React, { Component } from 'react';
import { Calendar } from './components';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Developed with React!</h1>
        </header>
        <div className="App-intro">
          <Calendar />
        </div>
      </div>
    );
  }
}

export default App;
