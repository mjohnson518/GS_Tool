import React from "react";
import "./App.css";
import { Link } from 'react-router-dom';

function Main() {
  return (
    <header className="App-header">
    <div className="profile-photo"></div>
    
      <p className="default">
        Coming Soon...<span className="blinking-cursor">|</span>
      </p>
      <div className="main_text">
            <Link to="/About">
              <button className="button">About</button>
            </Link>
      </div>
    </header>
  );
}

export default Main;