import types from '../../constants/deals'

export default (state = null, action) => {

  switch (action.type) {
    case types.SHOW_ATTACHMENTS:
      return {
        showCompose: action.showCompose,
        showAttachments: true,
        attachments: action.attachments
      }

    case types.UPDATE_ATTACHMENTS:
      return {
        showCompose: true,
        showAttachments: false,
        attachments: action.attachments
      }

    case types.CLOSE_ATTACHMENTS:
      return {
        ...state,
        showAttachments: false
      }

    case types.REMOVE_ATTACHMENT:
      return {
        ...state,
        ...{
          attachments: state.attachments.filter(id => id !== action.id)
        }
      }

    case types.CLOSE_ESIGN:
      return null

    default:
      return state
  }
}
