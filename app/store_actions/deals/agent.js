import types from '../../constants/deals'
import Deal from '../../models/Deal'

function addAgents(agents) {
  return {
    type: types.GET_AGENTS,
    agents
  }
}

export function getAgents(user) {
  return async (dispatch) => {
    const agents = await Deal.getAgents(user)
    dispatch(addAgents(agents))
  }
}
