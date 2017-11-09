import types from '../../constants/deals'

const initialState = {
  showCompose: false,
  showAttachments: false,
  attachments: [],
  recipients: {}
}

export default (state = initialState, action) => {

  switch (action.type) {
    case types.SHOW_ATTACHMENTS:
      return {
        ...state,
        showAttachments: action.display
      }

    case types.SHOW_COMPOSE:
      return {
        ...state,
        showCompose: action.display
      }

    case types.UPDATE_ATTACHMENTS:
      return {
        ...state,
        attachments: action.attachments
      }

    case types.REMOVE_ATTACHMENT:
      return {
        ...state,
        ...{
          attachments: state.attachments.filter(id => id !== action.id)
        }
      }

    case types.SET_RECIPIENT:
      return {
        ...state,
        recipients: {
          ...state.recipients,
          [action.recipient.email]: action.recipient
        }
      }

    case types.REMOVE_RECIPIENT:
      return {
        ...state,
        recipients: _.filter(state.recipients, recp => recp.email !== action.id)
      }

    case types.CLOSE_ESIGN_WIZARD:
      return initialState

    default:
      return state
  }
}
