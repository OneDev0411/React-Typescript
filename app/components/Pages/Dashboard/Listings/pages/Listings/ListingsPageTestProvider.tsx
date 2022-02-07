import { browserHistory, WithRouterProps } from 'react-router'

import { TestBed } from 'tests/unit/TestBed'

import ListingsOpenHouseProvider from './ListingsOpenHouseProvider'

export const routerProps: WithRouterProps = {
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

export function ListingsPageTestProvider({ customReduxState = {}, children }) {
  return (
    <TestBed reduxState={customReduxState}>
      <ListingsOpenHouseProvider>{children}</ListingsOpenHouseProvider>
    </TestBed>
  )
}
