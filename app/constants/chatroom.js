const ActionTypes = {}

new Array(
  'GET_ROOMS',
  'GET_MESSAGES',
  'CREATE_MESSAGE',
  'TOGGLE_CHATBAR',
  'TOGGLE_FULLSCREEN',
  'ADD_POPUP',
  'MINIMIZE_POPUP',
  'MAXIMIZE_POPUP',
  'CHANGE_ACTIVE_ROOM',
  'CHANGE_ACTIVE_POPUP',
  'REMOVE_POPUP'
)
.forEach(action => {
  ActionTypes[action] = `CHATROOM___${action}`
})

export default ActionTypes
