import { combineReducers } from 'redux'

import brandChecklists from './brand-checklists'
import checklists from './checklists'
import contexts from './contexts'
import envelopes from './envelopes'
import forms from './forms'
import list from './list'
import properties from './properties'
import roles from './roles'
import tasks from './tasks'
import upload from './upload'

export default combineReducers({
  properties,
  list,
  tasks,
  checklists,
  brandChecklists,
  roles,
  envelopes,
  forms,
  contexts,
  upload
})
