import types from '../../constants/socket'

/**
 * change socket status
 */
export function changeSocketStatus(status) {
  return {
    type: types.CHANGE_STATUS,
    status
  }
}

