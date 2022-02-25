import * as actionTypes from '@app/constants/user'
import type { SetImpersonateUserAction } from '@app/store_actions/user/impersonate-user'
import { BrandedUser } from '@app/views/components/TeamAgents/types'

export type IImpersonateUser = IUser | BrandedUser
export type IImpersonateUserState = Nullable<IImpersonateUser>

const defaultImpersonateUserState: IImpersonateUserState = null

function impersonateUserReducer(
  state: IImpersonateUserState = defaultImpersonateUserState,
  action: SetImpersonateUserAction
) {
  switch (action.type) {
    case actionTypes.SET_IMPERSONATE_USER:
      return action.payload

    default:
      return state
  }
}

export default impersonateUserReducer
