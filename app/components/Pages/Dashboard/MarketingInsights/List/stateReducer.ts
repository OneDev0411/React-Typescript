import { ListDataTypes, ActionTypes, ActionGeneralTypes } from './types'

export const initialState: ListDataTypes = {
  isLoading: true,
  hasError: false,
  list: [],
  stats: {
    scheduled: 0,
    sent: 0
  },
  activeFilter: null
}

const reducer = (state: ListDataTypes, action: ActionTypes) => {
  switch (action.type) {
    case ActionGeneralTypes.FETCH_REQUEST:
    case ActionGeneralTypes.FETCH_SUCCESS:
    case ActionGeneralTypes.FETCH_FAILED:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export default reducer
