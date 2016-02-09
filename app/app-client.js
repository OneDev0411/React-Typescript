// app-client.js
import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'
import history from './utils/history'

// Routes config
import react_routes from './routes/React/Config'

const router = (
  <Router history={ history }>
    { react_routes }
  </Router>
)

const app = document.getElementById('app')
render(router, app)