import type {
  UpdateActiveTeamSettinngAction,
  RequestActiveTeamAction,
  SetActiveTeamAction
} from 'actions/active-team'
import * as actionTypes from 'constants/user'

export type IActiveTeamState = Nullable<IUserTeam>

const defaultActiveTeamState: IActiveTeamState = null

function activeTeamReducer(
  state: IActiveTeamState = defaultActiveTeamState,
  action:
    | UpdateActiveTeamSettinngAction
    | RequestActiveTeamAction
    | SetActiveTeamAction
) {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_TEAM:
      return action.payload

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
