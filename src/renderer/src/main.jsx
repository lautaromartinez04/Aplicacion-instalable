import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { App } from './App'
import { HashRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </HashRouter>
)
