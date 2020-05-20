import * as actionTypes from '../../constants/deals'
import {
  CHANGE_VIEW_AS_FILTER_REQUEST,
  CHANGE_VIEW_AS_FILTER_SUCCESS,
  CHANGE_VIEW_AS_FILTER_FAILURE
} from '../../constants/user'

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

    case CHANGE_VIEW_AS_FILTER_SUCCESS:
    case CHANGE_VIEW_AS_FILTER_FAILURE:
      return {
        ...state,
        isFetchingDeals: false
      }

    default:
      return state
  }
}
