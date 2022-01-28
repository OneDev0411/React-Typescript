import { Dispatch } from 'redux'

import { getImpersonateUser as getImpersonateUserFromLocalStorage } from '@app/utils/impersonate-user'
import { BrandedUser } from '@app/views/components/TeamAgents/types'
import { SET_IMPERSONATE_USER } from 'constants/user'

import { IAppState } from '../../reducers'

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

export const getImpersonateUser =
  () => async (dispatch: Dispatch, getState: () => IAppState) => {
    try {
      const { impersonateUser } = getState()

      const user = getImpersonateUserFromLocalStorage()

      if (!impersonateUser && user) {
        dispatch(setImpersonateUser(user))
      }
    } catch (error) {
      console.error(error)
    }
  }
