import * as actionsType from '../../constants/user'
import upgrade from '../../models/user/upgrade-to-agent'

const upgradeToAgent = userInfo => async (dispatch, getState) => {
  dispatch({
    type: actionsType.UPGRADE_TO_AGENT_REQUEST
  })

  try {
    const user = await upgrade(userInfo)

    dispatch({
      user,
      type: actionsType.UPGRADE_TO_AGENT_SUCCESS
    })

    return user
  } catch (error) {
    throw error
  }
}

export default upgradeToAgent
