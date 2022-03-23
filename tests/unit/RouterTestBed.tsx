import { ReactNode } from 'react'

import { merge } from 'lodash'
import { Provider } from 'react-redux'
import { browserHistory, Router, WithRouterProps } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { DeepPartial } from 'redux'

import { AppTheme } from '../../app/AppTheme'
import { IAppState } from '../../app/reducers'
import routes from '../../app/routes'
import store from '../../app/stores'

import user from './fixtures/users/agent.json'

interface Props {
  reduxState?: Partial<Omit<IAppState, 'deals' | 'contacts'>> & {
    deals?: Partial<IAppState['deals']>
    contacts?: DeepPartial<IAppState['contacts']>
  }
  children: (props: WithRouterProps) => ReactNode
}

export function RouterTestBed({ reduxState, children }: Props) {
  merge(store.getState(), { user }, reduxState)

  const history = syncHistoryWithStore(browserHistory, store)

  const routerProps: WithRouterProps = {
    params: {},
    router: {
      push: jest.fn(),
      replace: jest.fn(),
      go: jest.fn(),
      goBack: jest.fn(),
      goForward: jest.fn(),
      setRouteLeaveHook: jest.fn(),
      createPath: jest.fn(),
      createHref: jest.fn(),
      isActive: jest.fn()
    },
    routes: [],
    location: browserHistory.getCurrentLocation()
  }

  // TODO: we should be able to use '<Router>' and '<Route>' here
  return (
    <Provider store={store}>
      <AppTheme>
        <Router history={history}>{routes}</Router>
        {children(routerProps)}
      </AppTheme>
    </Provider>
  )
}
