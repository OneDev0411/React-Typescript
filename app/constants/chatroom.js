const ActionTypes = {}

new Array(
  'GET_ROOMS',
  'GET_MESSAGES'
)
.forEach(action => {
  ActionTypes[action] = `CHATROOM___${action}`
})

export default ActionTypes
