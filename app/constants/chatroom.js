const ActionTypes = {}

new Array(
  'GET_ROOMS',
  'GET_MESSAGES',
  'CREATE_MESSAGE'
)
.forEach(action => {
  ActionTypes[action] = `CHATROOM___${action}`
})

export default ActionTypes
