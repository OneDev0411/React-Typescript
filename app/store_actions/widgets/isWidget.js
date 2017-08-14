import * as actionsType from '../../constants/widgets/isWidget'

const isWidget = (options, widgetOptions) => (dispatch) => {
  dispatch({
    type: actionsType.IS_WIDGET
  })
}

export default isWidget
