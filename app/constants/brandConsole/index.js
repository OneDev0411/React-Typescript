import role from './role'
import member from './member'

const ActionTypes = {}

new Array(
  ...role,
  ...member
)
.forEach(action => {
  ActionTypes[action] = `BRANDCONSOLE___${action}`
})

export default ActionTypes
