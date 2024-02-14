import { Router } from 'preact-router';
import Home from './Home';
import './app.css'

export function App() {

  return (
    <div id="app">
      <Router>
        <Home path="/jsonify/" />      
      </Router>
  </div>
  )
}
