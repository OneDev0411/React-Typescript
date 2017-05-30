const ActionTypes = {}

new Array(
  'GET_ROOMS',
  'GET_MESSAGES',
  'CREATE_MESSAGE',
  'TOGGLE_CHATBAR',
  'ADD_POPUP'
)
.forEach(action => {
  ActionTypes[action] = `CHATROOM___${action}`
})

export default ActionTypes
