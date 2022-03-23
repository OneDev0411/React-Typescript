import { BRAND_SUCCESS } from '../../constants/brand'
import { types } from '../../store_actions/data'

const initialState = {
  counter: 1
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_APP:
      const counter = !state.counter ? initialState.counter : state.counter + 1

      return {
        ...state,
        ...action.data,
        counter
      }
    case BRAND_SUCCESS:
      return {
        ...state,
        brand: action.brand
      }
    default:
      return state
  }
}
