"use strict"
import './styles/App.scss'

import Room from './pages/Room';
import Home from './pages/Home';
import NotFoundPage from './pages/404Page';

import {Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/room/*" component={Room} exact />
            <Route path="/room" component={Home} exact />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
