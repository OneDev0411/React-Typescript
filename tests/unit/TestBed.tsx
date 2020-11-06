import { Provider } from 'react-redux'

import * as React from 'react'
import { ReactNode } from 'react'

import { merge } from 'lodash'

import { DeepPartial } from 'redux'

import user from './fixtures/users/agent.json'

import { IAppState } from '../../app/reducers'
import store from '../../app/stores'
import { AppTheme } from '../../app/AppTheme'

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
  merge(store.getState(), { user }, reduxState)

  return (
    <Provider store={store}>
      <AppTheme>{children}</AppTheme>
    </Provider>
  )
}
