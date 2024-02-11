import { Router } from 'preact-router';
import Home from './Home';
import './app.css'
import Home1 from './Home1';

export function App() {

  return (
    <div id="app">
      <Router>
        <Home path="/jsonify/" />      
        <Home1 path="/jsonify/home1" />
      </Router>
  </div>
  )
}
