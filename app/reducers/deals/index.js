import { combineReducers } from 'redux'
import list from './list'
import tasks from './tasks'
import roles from './roles'
import checklists from './checklists'
import forms from './forms'
import selectedTask from './selected-task'
import esign from './esign'
import backoffice from './backoffice'
import upload from './upload'
import splitter from './pdf-splitter'
import agents from './agent'
import selectedRole from './selected-role'
import error from './error'
import spinner from './spinner'

export default combineReducers({
  list,
  tasks,
  checklists,
  roles,
  forms,
  esign,
  backoffice,
  selectedTask,
  selectedRole,
  upload,
  agents,
  splitter,
  error,
  spinner
})
