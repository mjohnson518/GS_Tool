import React from "react";
import './App.css';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p className="App-text">
        The Green Score is a critical measure of a Storage Providers (SPs) environmental performance, reflecting its commitment to sustainable practices and reducing emissions. 
        </p>
        <p className="App-text">
        A higher Green Score indicates more efficient energy use and less environmental impact, making it an essential tool for SPs to demonstrate their contributions towards achieving sustainability goals.  
        </p>
        <Link to="/GS">
              <button className="button">Get Started</button>
            </Link>
      </header>
      
    </div>
  );
}

export default App;