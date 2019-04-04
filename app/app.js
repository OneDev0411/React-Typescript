import React from 'react'
import NotificationsSystem from 'reapop'
import notificationTheme from 'reapop-theme-wybo'
import useScroll from 'react-router-scroll/lib/useScroll'
import ConfirmationModal from './components/Partials/Confirmation'
import { Router, browserHistory, applyRouterMiddleware } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import { hot } from 'react-hot-loader/root'

// import styles
import './styles/main.scss'

// Routes config
import routes from './routes'

// store
import store from './stores'


// history
const history = syncHistoryWithStore(browserHistory, store)

const A = () => (
  <div>
    <Router history={history} render={applyRouterMiddleware(useScroll())}>
      {routes}
    </Router>

    <NotificationsSystem theme={notificationTheme} />

    <ConfirmationModal />
  </div>
)

export default hot(A)