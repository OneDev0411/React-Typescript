import React, { Fragment } from 'react'
import NotificationsSystem from 'reapop'
import notificationTheme from 'reapop-theme-wybo'
import useScroll from 'react-router-scroll/lib/useScroll'

import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'
import { applyRouterMiddleware, browserHistory, Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import smoothscroll from 'smoothscroll-polyfill'

import { hot } from 'react-hot-loader/root'
import { StylesProvider, ThemeProvider } from '@material-ui/styles'

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
import { theme } from './theme'
import { MaterialUiGlobalOverrides } from './material-ui-global-overrides'

// history
const history = syncHistoryWithStore(browserHistory, store)

/**
 * We put history on window for e2e tests for
 * {@link Cypress.Chainable.navigate navigate command}
 */
if ((window as any).Cypress) {
  ; (window as any).__history = history
}

// smooth scroll polyfill
if (typeof window !== 'undefined') {
  smoothscroll.polyfill()
}

const App = () => (
  <>
    {/* Enable overriding styles with styled(SomeCmp)`...`. See https://material-ui.com/guides/interoperability#controlling-priority */}
    <StylesProvider injectFirst>
      {/* Provide theme for material-ui built-in components like buttons */}
      <ThemeProvider theme={theme}>
        {/* Provide theme to be used for our own styled components */}
        <StyledComponentsThemeProvider theme={theme}>
          <Fragment>
            <ConfirmationModalProvider>
              <Router
                history={history}
                render={applyRouterMiddleware(useScroll())}
              >
                {routes}
              </Router>
              <ConfirmationModal />
            </ConfirmationModalProvider>

            <NotificationsSystem theme={notificationTheme} />

            <ReduxConfirmationModal />
            <MaterialUiGlobalOverrides />
          </Fragment>
        </StyledComponentsThemeProvider>
      </ThemeProvider>
    </StylesProvider>
  </>
)

export default hot(App)
