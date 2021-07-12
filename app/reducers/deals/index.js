import { combineReducers } from 'redux'

import properties from './properties'
import list from './list'
import tasks from './tasks'
import roles from './roles'
import envelopes from './envelopes'
import checklists from './checklists'
import brandChecklists from './brand-checklists'
import forms from './forms'
import upload from './upload'
import contexts from './contexts'

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
