import { useDispatch } from 'react-redux'
import { browserHistory, Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { IntercomProvider } from 'react-use-intercom'
import smoothscroll from 'smoothscroll-polyfill'

import ConfirmationModal from '@app/views/components/ConfirmationModal'
import ConfirmationModalProvider from '@app/views/components/ConfirmationModal/context/Provider'
import { GlobalActionsProvider } from '@app/views/components/GlobalActionsButton/context/provider'
import { ReactQueryProvider } from '@app/views/components/ReactQueryProvider'
import { useAppcues } from 'services/appcues/use-appcues'

import config from '../config/public'

import { AppTheme } from './AppTheme'
// This is our new confirmation modal. use this please.
import ReduxConfirmationModal from './components/Partials/Confirmation'
import { Notifications } from './Notifications'
// Routes config
import routes from './routes'
import { activateIntercom } from './store_actions/intercom'
// This is a redux-based confirmation and will be deprecate asap.
// import styles
import './styles/main.scss'
// store
import store from './stores'

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

  useAppcues()

  return (
    <ReactQueryProvider>
      <AppTheme>
        <IntercomProvider
          appId={config.intercom.app_id}
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
    </ReactQueryProvider>
  )
}

export default App
