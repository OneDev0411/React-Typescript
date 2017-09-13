import * as actionsType from '../../constants/widgets'

const setWidget = (state = true) => dispatch => {
  dispatch({
    type: state ? actionsType.SET_WIDGET : actionsType.UNSET_WIDGET
  })
}

export default setWidget
