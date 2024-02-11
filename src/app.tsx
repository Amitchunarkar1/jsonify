import { useState } from 'preact/hooks'
import { Router } from 'preact-router';
import Home from './Home';
import './app.css'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <div id="app">
      <Router>
        <Home path="/" />
      </Router>
  </div>
  )
}
