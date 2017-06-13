import types from '../../constants/chatroom'

/**
 * change socket status
 */
export function changeSocketStatus(status) {
  return {
    type: types.CHANGE_STATUS,
    status
  }
}

