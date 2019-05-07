import React from 'react'
import NotificationsSystem from 'reapop'
import notificationTheme from 'reapop-theme-wybo'
import useScroll from 'react-router-scroll/lib/useScroll'

import { Router, browserHistory, applyRouterMiddleware } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import smoothscroll from 'smoothscroll-polyfill'

// The following polyfill is temporary fix for https://github.com/zloirock/core-js/issues/536
// core-js RegExp polyfill screws up toString method of native RegExp in IE and Edge,
// when useBuiltIns is set to "usage" in @babel/preset-env options.
// related issue in rechat: https://gitlab.com/rechat/web/issues/2587
import 'core-js/es/regexp/flags'

import { hot } from 'react-hot-loader/root'

// This is our new confirmation modal. use this please.
import ConfirmationModalProvider from 'components/ConfirmationModal/context/Provider'
import ConfirmationModal from 'components/ConfirmationModal'

// This is a redux-based confirmation and will be deprecate asap.
import ReduxConfirmationModal from './components/Partials/Confirmation'

// import styles
import './styles/main.scss'

// Routes config
import routes from './routes'

// store
import store from './stores'

// history
const history = syncHistoryWithStore(browserHistory, store)

// smooth scroll polyfill
if (typeof window !== 'undefined') {
  smoothscroll.polyfill()
}

const A = () => (
  <div>
    <ConfirmationModalProvider>
      <Router history={history} render={applyRouterMiddleware(useScroll())}>
        {routes}
      </Router>
      <ConfirmationModal />
    </ConfirmationModalProvider>

    <NotificationsSystem theme={notificationTheme} />

    <ReduxConfirmationModal />
  </div>
)

export default hot(A)
