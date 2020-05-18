import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { useDispatch } from 'react-redux'

import { IAppState } from 'reducers'

export type ReduxDispatch = ThunkDispatch<IAppState, any, AnyAction>

export function useReduxDispatch(): ReduxDispatch {
  return useDispatch<ReduxDispatch>()
}
