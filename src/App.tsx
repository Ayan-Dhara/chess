import './styles/App.scss'
import Room from './pages/Room';
import Home from './pages/Home';
import NotFoundPage from './pages/404Page';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import React from "react";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/room/*" element={<Room/>}/>
          <Route path="/room" element={<Home/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
