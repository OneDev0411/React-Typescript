import { putTeamSetting } from 'models/brand/put-team-setting'

import { getActiveTeamId } from 'utils/user-teams'

import { getUserTeams } from './teams'

export function updateTeamSetting(key: string, value: any) {
  return async (dispatch, getState) => {
    const { user } = getState()

    const activeTeamId = getActiveTeamId(user)

    if (activeTeamId) {
      await putTeamSetting(key, value, activeTeamId)
      await dispatch(getUserTeams(user))
    }
  }
}
