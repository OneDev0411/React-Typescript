import types from '../../constants/chatroom'

export default (state = false, action) => {
  switch (action.type) {

    case types.TOGGLE_INSTANT_MODE:
      const show = action.show ? action.show : !state

      // make under layer scroll hidden on fullscreen mode
      document.body.style.overflow = show ? 'hidden' : ''

      return show

    default:
      return state
  }
}
