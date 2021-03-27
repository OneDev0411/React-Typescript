import produce from 'immer'

import { noop } from 'utils/helpers'

import { SET_CREATE_CALLBACK_HANDLER } from '../constants'

import { StateContext } from '..'

export const initialState: StateContext = {
  onCreateEvent: noop,
  onCreateContact: undefined,
  onCreateAndAddNewContact: undefined,
  onCreateEmail: noop,
  onCreateEmailFollowUp: noop,
  onCreateTour: noop,
  onCreateOpenHouse: noop
}

interface Action {
  type: string
  handlers: RequireAtLeastOne<
    StateContext,
    | 'onCreateEvent'
    | 'onCreateContact'
    | 'onCreateAndAddNewContact'
    | 'onCreateEmail'
    | 'onCreateEmailFollowUp'
    | 'onCreateTour'
    | 'onCreateOpenHouse'
  >
}

export const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case SET_CREATE_CALLBACK_HANDLER:
      return produce(state, draft => {
        draft = {
          ...state,
          ...action.handlers
        }

        return draft
      })
    default:
      return state
  }
}
