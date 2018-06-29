import * as actionTypes from '../../constants/deals'
import Deal from '../../models/Deal'

export function getAgents(user) {
  return async dispatch => {
    const agents = await Deal.getAgents(user)

    dispatch({
      type: actionTypes.GET_AGENTS,
      agents
    })
  }
}
