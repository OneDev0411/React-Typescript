import produce from 'immer'

import { noop } from 'utils/helpers'

import { StateContextType } from '..'
import { SET_CREATE_CALLBACK_HANDLER } from '../constants'

export const initialState: StateContextType = {
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
    StateContextType,
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
