import uniqBy from 'lodash/uniqBy'

import { StateContext } from '..'
import {
  ADD_ATTACHMENTS,
  CLEAR_ATTACHMENTS,
  REMOVE_ATTACHMENT
} from '../constants'

export const initialState: StateContext = {
  attachments: []
}

export function reducer(state = initialState, action: Pick<any, any>) {
  switch (action.type) {
    case ADD_ATTACHMENTS:
      return {
        ...state,
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
        attachments: []
      }

    default:
      return state
  }
}
