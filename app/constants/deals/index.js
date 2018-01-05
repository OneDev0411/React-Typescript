import deals from './deals'
import forms from './forms'
import esign from './esign'
import task from './task'
import checklist from './checklist'
import upload from './upload'
import splitter from './splitter'
import backoffice from './backoffice'
import agent from './agent'
import role from './role'
import error from './error'

const ActionTypes = {}

new Array(
  ...deals,
  ...forms,
  ...esign,
  ...task,
  ...checklist,
  ...upload,
  ...splitter,
  ...backoffice,
  ...agent,
  ...role,
  ...error
)
.forEach(action => {
  ActionTypes[action] = `DEALS___${action}`
})

export default ActionTypes
