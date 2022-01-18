import * as actionTypes from '@app/constants/user'
import type {
  UpdateActiveTeamSettinngAction,
  SetUserAndActiveTeamAction,
  RequestActiveTeamAction,
  SetActiveTeamAction
} from '@app/store_actions/active-team'

export type IActiveTeamState = Nullable<IUserTeam>

const defaultActiveTeamState: IActiveTeamState = null

function activeTeamReducer(
  state: IActiveTeamState = defaultActiveTeamState,
  action:
    | UpdateActiveTeamSettinngAction
    | SetUserAndActiveTeamAction
    | RequestActiveTeamAction
    | SetActiveTeamAction
) {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_TEAM:
      return action.payload

    case actionTypes.SET_USER_AND_ACTIVE_TEAM:
      return action.payload.team

    case actionTypes.UPDATE_ACTIVE_TEAM_SETTING:
      const currentSettings = state?.settings ?? {}

      return {
        ...state,
        settings: {
          ...currentSettings,
          [action.payload.key]: action.payload.value
        }
      }
    default:
      return state
  }
}

export default activeTeamReducer
