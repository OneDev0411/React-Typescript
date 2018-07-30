import * as actionTypes from '../../constants/deals'

const initialState = {
  showCompose: false,
  showAttachments: false,
  attachments: [],
  recipients: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_ATTACHMENTS:
      return {
        ...state,
        showAttachments: action.display
      }

    case actionTypes.SHOW_COMPOSE:
      return {
        ...state,
        showCompose: action.display
      }

    case actionTypes.ADD_ATTACHMENT:
      return {
        ...state,
        attachments: [...state.attachments, action.attachment]
      }

    case actionTypes.REMOVE_ATTACHMENT:
      return {
        ...state,
        attachments: state.attachments.filter(
          attachment => attachment.id !== action.attachment.id
        )
      }

    case actionTypes.SET_RECIPIENT:
      return {
        ...state,
        recipients: [...state.recipients, action.recipient]
      }

    case actionTypes.REMOVE_RECIPIENT:
      return {
        ...state,
        recipients: _.filter(state.recipients, recp => recp.role !== action.id)
      }

    case actionTypes.CLOSE_ESIGN_WIZARD:
      return initialState

    default:
      return state
  }
}
