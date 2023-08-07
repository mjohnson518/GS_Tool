import React from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Routes, Route} from "react-router-dom";
import { Link } from "react-router-dom";
import About from "./About";
import Main from "./main";
import GS from './GS';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
       <Navbar expand="lg" variant="dark" bg="light" sticky="top" className="NavBar">
        <Nav className="flex-grow-1">
          <Link to="/" className="hamburger">
           <FontAwesomeIcon color="black" icon={faBars} className="hamburger" />
          </Link> 
        </Nav>
      </Navbar>
      <div className="me-auto">
        <Routes>
        <Route exact path="/" element={<Main />} />
          <Route exact path="/About" element={<About />} />
          <Route exact path="/GS" element={<GS />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;