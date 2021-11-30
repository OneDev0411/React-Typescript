import type {
  RequestActiveTeamAction,
  SetActiveTeamAction
} from 'actions/active-team'
import * as actionTypes from 'constants/user'

export type IActiveTeamState = Nullable<IUserTeam>

const defaultActiveTeamState: IActiveTeamState = null

function activeTeamReducer(
  state: IActiveTeamState = defaultActiveTeamState,
  action: RequestActiveTeamAction | SetActiveTeamAction
) {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_TEAM:
      return action.payload

    default:
      return state
  }
}

export default activeTeamReducer
