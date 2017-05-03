// app-client.js
import React from 'react'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'

// Routes config
import routes from './routes'

// store
import store from './stores'

// history
const history = syncHistoryWithStore(browserHistory, store)

// import styles
import './styles/main.scss'

export default () => (
  <Provider store={store}>
    <Router history={history}>
      { routes }
    </Router>
  </Provider>
)
