import { Location as LegacyLocation, LocationState } from 'history'
import {
  InjectedRouter,
  PlainRoute,
  WithRouterProps as LegacyRouterProps
} from 'react-router'

import { NavigateFunction } from '@app/hooks/use-navigate'
import { SetURLSearchParams } from '@app/hooks/use-search-param'

export interface ExtendedWithRouterProps {
  navigate: NavigateFunction
  searchParams: URLSearchParams
  setSearchParams: SetURLSearchParams
}

export interface Location extends Omit<LegacyLocation, 'query' | 'state'> {
  state?: LocationState
}

export type WithRouterProps<P = any> = ExtendedWithRouterProps &
  Omit<LegacyRouterProps<P>, 'location'> & {
    location: Location
  }

export interface RouteComponentProps<P = {}, R = {}, ComponentProps = any>
  extends Omit<WithRouterProps, 'params'> {
  params: P & R
  route: PlainRoute<ComponentProps>
  router: InjectedRouter
  routes: PlainRoute[]
  routeParams: R
}
