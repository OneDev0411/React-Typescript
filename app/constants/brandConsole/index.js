import role from './role'
import member from './member'
import checklist from './checklist'

const ActionTypes = {}

new Array(
  ...role,
  ...member,
  ...checklist
)
  .forEach(action => {
    ActionTypes[action] = `BRANDCONSOLE___${action}`
  })

export default ActionTypes
