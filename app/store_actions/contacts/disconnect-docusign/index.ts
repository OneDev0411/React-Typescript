import { ThunkDispatch } from 'redux-thunk'

import { disconnectDocuSign as disconnect } from 'models/o-auth-accounts/disconnect-docusign'
import { IOAuthAccountAction } from 'reducers/contacts/oAuthAccounts'

import { DISCONNECT_DOCUSIGN_SUCCESS } from '../../../constants/contacts'

export function disconnectDocuSign() {
  return async (dispatch: ThunkDispatch<any, any, IOAuthAccountAction>) => {
    const updatedAccount = await disconnect()

    dispatch({
      account: updatedAccount,
      type: DISCONNECT_DOCUSIGN_SUCCESS
    })
  }
}
