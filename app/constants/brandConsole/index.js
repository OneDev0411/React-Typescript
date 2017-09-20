import role from './role'
import member from './member'
import checklist from './checklist'
import task from './task'
import brand from './brand'
import spinner from './spinner'

const ActionTypes = {}

new Array(
  ...role,
  ...member,
  ...checklist,
  ...task,
  ...brand,
  ...spinner
)
  .forEach(action => {
    ActionTypes[action] = `BRANDCONSOLE___${action}`
  })

export default ActionTypes
