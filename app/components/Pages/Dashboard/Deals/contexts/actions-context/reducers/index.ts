import uniqBy from 'lodash/uniqBy'

import { StateContext } from '..'
import {
  ADD_ATTACHMENTS,
  CLEAR_ATTACHMENTS,
  REMOVE_ATTACHMENT,
  SET_DRAWER_STATUS
} from '../constants'

export const initialState: StateContext = {
  isDrawerOpen: false,
  actions: [],
  attachments: []
}

export function reducer(state = initialState, action: Pick<any, any>) {
  switch (action.type) {
    case ADD_ATTACHMENTS:
      return {
        ...state,
        actions: action.actions ?? state.actions,
        attachments: action.attachments
          ? uniqBy(
              [...state.attachments, ...action.attachments],
              (attachment: IDealFile) =>
                attachment.id ? attachment.id : attachment.url
            )
          : state.attachments
      }

    case REMOVE_ATTACHMENT:
      return {
        ...state,
        attachments: state.attachments.filter(attachment =>
          attachment.id
            ? attachment.id !== action.attachment.id
            : attachment.url !== action.attachment.url
        )
      }

    case SET_DRAWER_STATUS:
      return {
        ...state,
        isDrawerOpen: action.isDrawerOpen
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
