import * as actionsType from '../../constants/widgets'

const data = (state = false, action) => {
  switch (action.type) {
    case actionsType.SET_WIDGET:
      return true
    case actionsType.UNSET_WIDGET:
      return false
    default:
      return state
  }
}

export default data
