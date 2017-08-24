import types from '../../constants/deals'

export default (state = null, action) => {

  switch (action.type) {
    case types.SHOW_ATTACHMENTS:
      return {
        show: true,
        view: 'attachment',
        attachments: action.attachments
      }

    case types.UPDATE_ATTACHMENTS:
      return {
        show: true,
        view: 'compose',
        attachments: action.attachments
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
