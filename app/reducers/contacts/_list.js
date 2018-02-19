import types from '../../constants/contact'

export default (state = null, action) => {
  switch (action.type) {
    case types.UPSERT_ATTRIBUTES:
      return {
        ...state,
        [action.id]: {
          ...action.contact,
          timeline: state[action.id].timeline
        }
      }

    default:
      return state
  }
}
