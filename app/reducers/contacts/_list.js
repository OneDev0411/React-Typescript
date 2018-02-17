import types from '../../constants/contact'

export default (state = null, action) => {
  switch (action.type) {
    case types.ADD_CONTACT:
    case types.UPDATE_CONTACT:
      return {
        [action.contact.id]: action.contact,
        ...state
      }

    case types.ADD_NOTE:
    case types.UPSERT_ATTRIBUTES:
    case types.DELETE_ATTRIBUTE:
      return {
        ...state,
        [action.id]: {
          ...action.contact,
          timeline: state[action.id].timeline
        }
      }
    case types.UPLOAD_CVS: {
      return { ...state, ...action.contacts }
    }

    default:
      return state
  }
}
