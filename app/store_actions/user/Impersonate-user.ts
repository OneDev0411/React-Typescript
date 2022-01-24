import { Dispatch } from 'redux'

import { BrandedUser } from '@app/views/components/TeamAgents/types'
import { SET_IMPERSONATE_USER } from 'constants/user'

export const setImpersonateUser = (user: BrandedUser) => {
  return {
    type: SET_IMPERSONATE_USER,
    payload: user
  } as const
}

export type SetImpersonateUserAction = ReturnType<typeof setImpersonateUser>

/**
 * Check Impersonate user exist and if so store it in Redux
 */

export const getImpersonateUser = () => async (dispatch: Dispatch) => {
  try {
    // dispatch(setImpersonateUser(user))
  } catch (error) {
    console.error(error)
  }
}
