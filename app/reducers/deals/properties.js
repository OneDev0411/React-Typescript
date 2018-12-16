import * as actionTypes from '../../constants/deals'
import { CHANGE_VIEW_AS_FILTER_REQUEST } from '../../constants/user'

const initialState = {
  error: null,
  selectedTask: null,
  isFetchingDeals: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_DEALS:
      return {
        ...state,
        error: null
      }

    case actionTypes.GET_DEALS_FAILED:
      return {
        ...state,
        error: {
          action: action.name,
          message: action.message
        }
      }

    case actionTypes.SET_SELECTED_TASK:
      return {
        ...state,
        selectedTask: action.task
      }

    case CHANGE_VIEW_AS_FILTER_REQUEST:
    case actionTypes.SET_FETCHING_STATUS:
      return {
        ...state,
        isFetchingDeals: action.status
      }

    default:
      return state
  }
}
