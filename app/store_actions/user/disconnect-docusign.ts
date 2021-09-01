import { disconnectDocuSign as disconnect } from 'models/user/disconnect-docusign'

import { DISCONNECT_DOCUSIGN } from '../../constants/user'

export function disconnectDocuSign() {
  return async dispatch => {
    await disconnect()

    dispatch({
      type: DISCONNECT_DOCUSIGN
    })
  }
}
