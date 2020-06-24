import uniqBy from 'lodash/uniqBy'

import { StateContext } from '..'
import {
  ADD_ATTACHMENTS,
  CLEAR_ATTACHMENTS,
  REMOVE_ATTACHMENT
} from '../constants'

export const initialState: StateContext = {
  actions: [],
  attachments: []
}

export function reducer(state = initialState, action: Pick<any, any>) {
  switch (action.type) {
    case ADD_ATTACHMENTS:
      return {
        ...state,
        actions: action.actions ?? state.actions,
        attachments: uniqBy(
          [...state.attachments, ...action.attachments],
          (attachment: IDealFile) => attachment.id
        )
      }

    case REMOVE_ATTACHMENT:
      return {
        ...state,
        attachments: state.attachments.filter(
          attachment => attachment.id !== action.attachment.id
        )
      }

    case CLEAR_ATTACHMENTS:
      return {
        ...state,
        actions: [],
        attachments: []
      }

    default:
      return state
  }
}
