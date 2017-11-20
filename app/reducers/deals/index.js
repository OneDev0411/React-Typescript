import { combineReducers } from 'redux'
import list from './list'
import tasks from './tasks'
import checklists from './checklists'
import forms from './forms'
import selectedTask from './selected-task'
import esign from './esign'
import backoffice from './backoffice'
import upload from './upload'
import error from './error'

export default combineReducers({
  list,
  tasks,
  checklists,
  forms,
  esign,
  backoffice,
  selectedTask,
  upload,
  error
})
