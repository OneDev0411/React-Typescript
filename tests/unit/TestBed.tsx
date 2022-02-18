import { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { Router, browserHistory, Route } from 'react-router'
import { applyMiddleware, createStore /* compose */, DeepPartial } from 'redux'
import { enableBatching } from 'redux-batched-actions'
import thunk from 'redux-thunk'

import ConfirmationModal from '@app/views/components/ConfirmationModal'
import ConfirmationModalProvider from '@app/views/components/ConfirmationModal/context/Provider'

import { AppTheme } from '../../app/AppTheme'
import reducers, { IAppState } from '../../app/reducers'

import activeTeam from './fixtures/active-team/8cb4a358-8973-11e7-9089-0242ac110003.json'
import user from './fixtures/users/agent.json'

export const queryClient = new QueryClient({
  defaultOptions: {}
})

interface Props {
  reduxState?: Partial<Omit<IAppState, 'deals' | 'contacts'>> & {
    deals?: Partial<IAppState['deals']>
    contacts?: DeepPartial<IAppState['contacts']>
  }
  children: ReactNode
}

/**
 * A Wrapper component to render unit tests within it, if they need contextual
 * stuff like redux, theme, etc.
 *
 * We can create common wrappers which provide common redux configuration
 * (or other context stuff) on top of it. e.g. AgentUserTestBed,
 * ContactsTestBed, DealsTestBed etc.
 */
export function TestBed({ reduxState, children }: Props) {
  const store = createStore(
    enableBatching(reducers),
    { user, activeTeam, ...reduxState },
    applyMiddleware(thunk)
  )

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppTheme>
          <ConfirmationModalProvider>
            <Router history={browserHistory}>
              <Route path="*" component={() => <>{children}</>} />
            </Router>
            <ConfirmationModal />
          </ConfirmationModalProvider>
        </AppTheme>
      </QueryClientProvider>
    </Provider>
  )
}
