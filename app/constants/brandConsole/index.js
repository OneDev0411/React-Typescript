import role from './role'
import member from './member'
import checklist from './checklist'
import task from './task'
import brand from './Brand'

const ActionTypes = {}

new Array(
  ...role,
  ...member,
  ...checklist,
  ...task,
  ...brand
)
  .forEach(action => {
    ActionTypes[action] = `BRANDCONSOLE___${action}`
  })

export default ActionTypes
