import React from 'react'
import NotificationsSystem from 'reapop'
import notificationTheme from 'reapop-theme-wybo'
import { browserHistory, Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import smoothscroll from 'smoothscroll-polyfill'

import { hot } from 'react-hot-loader/root'

import ConfirmationModalProvider from 'components/ConfirmationModal/context/Provider'
// This is our new confirmation modal. use this please.
import ConfirmationModal from 'components/ConfirmationModal'

// This is a redux-based confirmation and will be deprecate asap.
import ReduxConfirmationModal from './components/Partials/Confirmation'
// import styles
import './styles/main.scss'
// Routes config
import routes from './routes'
// store
import store from './stores'
import { AppTheme } from './AppTheme'

// history
const history = syncHistoryWithStore(browserHistory, store)

/**
 * We put history on window for e2e tests for
 * {@link Cypress.Chainable.navigate navigate command}
 */
if ((window as any).Cypress) {
  ;(window as any).__history = history
}

// smooth scroll polyfill
if (typeof window !== 'undefined') {
  smoothscroll.polyfill()
}

const App = () => (
  <AppTheme>
    <ConfirmationModalProvider>
      <Router history={history}>{routes}</Router>
      <ConfirmationModal />
    </ConfirmationModalProvider>

    <NotificationsSystem theme={notificationTheme} />

    <ReduxConfirmationModal />
  </AppTheme>
)

export default hot(App)
