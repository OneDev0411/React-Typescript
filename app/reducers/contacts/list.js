import types from '../../constants/contact'

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_CONTACTS:
      return action.contacts

    case types.GET_TIMELINE:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          timeline: action.timeline
        }
      }

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

// state: Object - Contacts state
export const getContactsList = state => {
  const { list } = state

  if (list) {
    return Object.keys(list).map(id => list[id])
  }

  return []
}
