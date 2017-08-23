import role from './role'
import member from './member'
import checklist from './checklist'
import task from './task'

const ActionTypes = {}

new Array(
  ...role,
  ...member,
  ...checklist,
  ...task
)
  .forEach(action => {
    ActionTypes[action] = `BRANDCONSOLE___${action}`
  })

export default ActionTypes
