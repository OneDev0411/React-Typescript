// app-client.js
import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
const history = createBrowserHistory()

// Routes config
import routes_config from './routes/React.config'

const routes = (
  <Router history={history}>
    { routes_config }
  </Router>
)

const app = document.getElementById('app')
render(routes, app)