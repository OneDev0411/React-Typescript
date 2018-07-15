import { combineReducers } from 'redux'

import properties from './properties'
import list from './list'
import tasks from './tasks'
import roles from './roles'
import envelopes from './envelopes'
import checklists from './checklists'
import forms from './forms'
import esign from './esign'
import upload from './upload'
import splitter from './pdf-splitter'
import contexts from './contexts'
import templates from './templates'

export default combineReducers({
  properties,
  list,
  tasks,
  checklists,
  roles,
  envelopes,
  forms,
  esign,
  contexts,
  upload,
  splitter,
  templates
})
