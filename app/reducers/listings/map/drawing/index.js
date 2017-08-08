import * as actionsType from '../../../../constants/listings/map'

const initialState = {
  isDrawing: false,
  shape: {},
  points: []
}

const drawing = (state = initialState, action) => {
  switch (action.type) {
    case actionsType.ACTIVE_DRAWING:
      return {
        ...state,
        isDrawing: true
      }
    case actionsType.INACTIVE_DRAWING:
      return {
        ...state,
        isDrawing: false
      }
    case actionsType.SET_POLYGON:
      return {
        ...state,
        ...action.polygon
      }
    case actionsType.REMOVE_POLYGON:
      return {
        ...state,
        shape: {},
        points: []
      }
    default:
      return state
  }
}

export default drawing
