import { SET_USER_SETTING } from '../../constants/user'
import { putUserSetting } from '../../models/user/put-user-setting'
import { getTeams } from '../../models/user/get-teams'

/**
 * Put a key value data as user settings data under
 * the specific brand and update user object
 * @param {string} key The setting key
 * @param {any} value The setting value
 * @param {UUID} [brand] The active brand id
 */

export function setUserSetting(key: string, value: any, brand: UUID) {
  return async (dispatch, getState) => {
    const user = getState().user

    try {
      const res = await putUserSetting(key, value, brand)

      if (Array.isArray(res.body) && res.body[0]) {
        const currentTeamId: string = `${res.body[0].user}_${res.body[0].brand}`
        let payload: IUser = user

        if (user.teams) {
          payload = {
            ...user,
            teams: user.teams.map(team => {
              if (currentTeamId === team.id) {
                return {
                  ...team,
                  settings: {
                    ...team.settings,
                    [key]: value
                  }
                }
              }

              return team
            })
          }
        } else {
          const teams: IUserTeam[] = await getTeams(user)

          payload = {
            ...user,
            teams
          }
        }

        return dispatch({
          type: SET_USER_SETTING,
          user: payload
        })
      }
    } catch (error) {
      console.error(error)
    }
  }
}
