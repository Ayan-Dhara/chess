import './styles/App.scss';

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
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/room/*" component={Room} exact />
          <Route path="/room" component={Home} exact />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
