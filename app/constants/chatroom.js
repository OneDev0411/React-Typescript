const ActionTypes = {}

new Array(
  'CHANGE_STATUS',
  'GET_ROOMS',
  'CREATE_ROOM',
  'ADD_MEMBERS',
  'GET_MESSAGES',
  'CREATE_MESSAGE',
  'TOGGLE_CHATBAR',
  'TOGGLE_INSTANCE_MODE',
  'ADD_POPUP',
  'MINIMIZE_POPUP',
  'MAXIMIZE_POPUP',
  'CHANGE_ACTIVE_ROOM',
  'CHANGE_ACTIVE_POPUP',
  'REMOVE_POPUP',
  'ADD_MESSAGE_TYPING',
  'REMOVE_MESSAGE_TYPING',
  'INITIAL_USER_STATES',
  'UPDATE_USER_STATE',
  'UPDATE_ROOM_NOTIFICATIONS',
  'RESET_ROOM_NOTIFICATIONS'
)
.forEach(action => {
  ActionTypes[action] = `CHATROOM___${action}`
})

export default ActionTypes
