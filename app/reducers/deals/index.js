import { combineReducers } from 'redux'
import list from './list'
import tasks from './tasks'
import checklists from './checklists'
import forms from './forms'
import formEdit from './form-edit'
import formViewer from './form-viewer'
import esign from './esign'
import backoffice from './backoffice'
import error from './error'

export default combineReducers({
  list,
  tasks,
  checklists,
  forms,
  formEdit,
  formViewer,
  esign,
  backoffice,
  error
})
