const ActionTypes = {}

new Array(
  'SHOW_CONFIRMATION',
  'HIDE_CONFIRMATION'
)
.forEach(action => {
  ActionTypes[action] = `DEALS___${action}`
})

export default ActionTypes
