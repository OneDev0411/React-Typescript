import React from 'react'
import NotificationsSystem from 'reapop'
import notificationTheme from 'reapop-theme-wybo'
import { Router, browserHistory, applyRouterMiddleware } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import useScroll from 'react-router-scroll/lib/useScroll'

import ConfirmationModal from './components/Partials/Confirmation'

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
    <div>
      <Router history={history} render={applyRouterMiddleware(useScroll())}>
        {routes}
      </Router>

      <NotificationsSystem theme={notificationTheme} />

      <ConfirmationModal />
    </div>
  </Provider>
)
