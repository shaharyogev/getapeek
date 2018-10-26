import React, { Component } from 'react';
import './App.css';
import PcListData from './components/PcListData/PcListData';

class App extends Component {
  render() {
    return (
      <div className="App">
        <PcListData></PcListData>
      </div>
    );
  }
}

export default App;
