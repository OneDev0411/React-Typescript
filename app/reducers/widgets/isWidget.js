import * as actionsType from '../../constants/widgets/isWidget'

const data = (state = false, action) => {
  switch (action.type) {
    case actionsType.IS_WIDGET:
      return true
    default:
      return state
  }
}

export default data