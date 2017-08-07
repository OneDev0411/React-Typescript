import { combineReducers } from 'redux'
import list from './list'
import tasks from './tasks'
import checklists from './checklists'
import forms from './forms'
import formEdit from './form-edit'

export default combineReducers({
  list,
  tasks,
  checklists,
  forms,
  formEdit
})
