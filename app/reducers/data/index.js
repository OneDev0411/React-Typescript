import { types } from '../../store_actions/data'
import { BRAND_SUCCESS } from '../../constants/brand'
import { EDIT_USER_SUCCESS } from '../../constants/user'
import { SIGNIN_SUCCESS } from '../../constants/auth/signin'

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
    case SIGNIN_SUCCESS:
      return {
        ...state,
        user: action.user
      }
    case EDIT_USER_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.user
        }
      }
    default:
      return state
  }
}
