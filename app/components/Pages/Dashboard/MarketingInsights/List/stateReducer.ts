import { ListDataTypes, ActionTypes, ActionGeneralTypes } from './types'

export const initialState: ListDataTypes = {
  isLoading: true,
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
      return {
        ...state,
        ...action.payload
      }
    default:
      throw new Error()
  }
}

export default reducer
