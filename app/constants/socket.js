const ActionTypes = {}

new Array(
  'CHANGE_STATUS'
)
.forEach(action => {
  ActionTypes[action] = `SOCKET___${action}`
})

export default ActionTypes
