import React from 'react'
import { browserHistory, Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import smoothscroll from 'smoothscroll-polyfill'
import { useDispatch } from 'react-redux'

import { hot } from 'react-hot-loader/root'

import { IntercomProvider } from 'react-use-intercom'

import ConfirmationModalProvider from 'components/ConfirmationModal/context/Provider'
import { GlobalActionsProvider } from 'components/GlobalActionsButton/context/provider'
// This is our new confirmation modal. use this please.
import ConfirmationModal from 'components/ConfirmationModal'

import { activateIntercom } from './store_actions/intercom'

// This is a redux-based confirmation and will be deprecate asap.

import ReduxConfirmationModal from './components/Partials/Confirmation'
// import styles
import './styles/main.scss'
// Routes config
import routes from './routes'
// store
import store from './stores'
import { AppTheme } from './AppTheme'

import config from '../config/public'

import { Notifications } from './Notifications'

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

const App = () => {
  const dispatch = useDispatch()

  return (
    <AppTheme>
      <IntercomProvider
        appId={config.intercom.app_id}
        autoBoot
        onShow={() => dispatch(activateIntercom())}
      >
        <GlobalActionsProvider>
          <ConfirmationModalProvider>
            <Router history={history}>{routes}</Router>
            <ConfirmationModal />
          </ConfirmationModalProvider>

          <ReduxConfirmationModal />

          <Notifications />
        </GlobalActionsProvider>
      </IntercomProvider>
    </AppTheme>
  )
}

export default hot(App)
