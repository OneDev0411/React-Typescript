import * as actionsType from '../../../../constants/listings/map'

const initialState = {
  isFetching: false,
  changeLocationCanceled: false
}

const userLocation = (state = initialState, action) => {
  switch (action.type) {
    case actionsType.START_GET_USER_LOCATION:
      return {
        ...state,
        isFetching: true
      }
    case actionsType.GET_USER_LOCATION_DONE:
      return {
        ...state,
        isFetching: false
      }

    default:
      return state
  }
}

export default userLocation

export const getUserLocationIsFetching = state => state.isFetching
