import { ReactNode } from 'react'

import { Provider } from 'react-redux'
import { applyMiddleware, createStore /* compose */, DeepPartial } from 'redux'
import { enableBatching } from 'redux-batched-actions'
import thunk from 'redux-thunk'

import { AppTheme } from '../../app/AppTheme'
import reducers, { IAppState } from '../../app/reducers'

import user from './fixtures/users/agent.json'

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
    { user, ...reduxState },
    applyMiddleware(thunk)
  )

  return (
    <Provider store={store}>
      <AppTheme>{children}</AppTheme>
    </Provider>
  )
}
