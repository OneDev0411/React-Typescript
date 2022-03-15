import { Dispatch } from 'redux'

import { getActiveTeam } from '@app/models/user/get-active-team'
import { putUserSetting } from '@app/models/user/put-user-setting'
import { SIGNIN_SUCCESS } from 'constants/auth/signin'
import {
  UPDATE_ACTIVE_TEAM_SETTING,
  SET_USER_AND_ACTIVE_TEAM,
  ACTIVE_TEAM_REQUEST,
  SET_ACTIVE_TEAM
} from 'constants/user'

const requestActiveTeam = () =>
  ({
    type: ACTIVE_TEAM_REQUEST
  } as const)

export type RequestActiveTeamAction = ReturnType<typeof requestActiveTeam>

export const setActiveTeam = (team: IUserTeam) =>
  ({
    type: SET_ACTIVE_TEAM,
    payload: team
  } as const)

export type SetActiveTeamAction = ReturnType<typeof setActiveTeam>

export const setUserAndActiveTeam = (
  user: IUser,
  team: Nullable<IUserTeam>
) => {
  if (team === null) {
    return {
      type: SIGNIN_SUCCESS,
      user
    } as const
  }

  return {
    type: SET_USER_AND_ACTIVE_TEAM,
    payload: { user, team }
  } as const
}

export type SetUserAndActiveTeamAction = ReturnType<typeof setUserAndActiveTeam>

const updateActiveTeamSetting = (key: string, value: any) =>
  ({
    type: UPDATE_ACTIVE_TEAM_SETTING,
    payload: {
      key,
      value
    }
  } as const)

export type UpdateActiveTeamSettinngAction = ReturnType<
  typeof updateActiveTeamSetting
>

/**
 * Fetch active team and set on Redux
 */

export const fetchActiveTeam = () => async (dispatch: Dispatch) => {
  try {
    const activeTeam = await getActiveTeam()

    if (activeTeam !== null) {
      dispatch(setActiveTeam(activeTeam))
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * Put a key-value data on the active team settings
 * @param {string} key The setting key
 * @param {any} value The setting value
 * @param {UUID} [brand] The active brand id
 */

export const setActiveTeamSetting =
  (key: string, value: any, brand?: UUID) => async (dispatch: Dispatch) => {
    try {
      await putUserSetting(key, value, brand)

      dispatch(updateActiveTeamSetting(key, value))
    } catch (error) {
      console.error(error)
    }
  }
