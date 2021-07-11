import './styles/App.scss';

import {Component} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from 'react-router-dom';

import Room from './pages/Room';
import Home from './pages/Home';
import NotFoundPage from './pages/404Page';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/room" component={Home} exact />
          <Route path="/room/*" component={Room} exact />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    );
  }
}
export default App;
