// app-client.js
import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'
import history from './utils/history'

// Routes config
import routes from './routes'

// import styles
import './styles/main.scss'

export default () => (
  <Router history={ history }>
    { routes }
  </Router>
)
