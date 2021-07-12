import types from '../../constants/socket'

const initialState = {
  status: 'connected'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.CHANGE_STATUS:
      return {
        ...state,
        ...{ status: action.status }
      }

    default:
      return state
  }
}
