import types from '../../constants/contact'
import _ from 'underscore'

const initialState = {
  list: null,
  tags: null
}

export default (state = initialState, action) => {
  switch (action.type) {

    case types.GET_CONTACTS:
      return {
        ...state,
        ...{list: action.contacts}
      }

    case types.GET_TAGS:
      return {
        ...state,
        ...{tags: action.tags}
      }

    case types.GET_TIMELINE:
      return {
        ...state,
        ...{list: {
          ...state.list,
          ...{[action.id]: {
            ...state.list[action.id],
            ...{timeline: action.timeline}
          }}
        }}
      }

    case types.ADD_CONTACT:
      return {
        ...state,
        ...{list: {
          ...{[action.contact.id]: action.contact},
          ...state.list
        }}
      }

    case types.ADD_NOTE:
    case types.UPSERT_ATTRIBUTES:
    case types.DELETE_ATTRIBUTE:
      return {
        ...state,
        ...{list: {
          ...state.list,
          ...{[action.id]: {
            ...action.contact,
            ...{timeline: state.list[action.id].timeline}
          }}
        }}
      }

    default:
      return state
  }
}
