import deals from './deals'
import forms from './forms'
import esign from './esign'
import task from './task'
import checklist from './checklist'
import backoffice from './backoffice'
import error from './error'

const ActionTypes = {}

new Array(
  ...deals,
  ...forms,
  ...esign,
  ...task,
  ...checklist,
  ...backoffice,
  ...error
)
.forEach(action => {
  ActionTypes[action] = `DEALS___${action}`
})

export default ActionTypes
