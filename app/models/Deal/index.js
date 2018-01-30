import _ from 'underscore'
import config from '../../../config/public'
import Fetch from '../../services/fetch'
import contextHelper from './context-helper'
import context from './context'
import uploadHelper from './upload-helper'
import deal from './deal'
import search from './search'
import envelope from './envelope'
import role from './role'
import place from './place'
import form from './form'
import task from './task'
import pdfSplitter from './pdf-splitter'
import attachment from './attachment'
import agent from './agent'
import submission from './submission'
import checklist from './checklist'
import listing from './listing'
import offer from './offer'

export default {
  get: contextHelper,
  upload: uploadHelper,
  ...deal,
  ...search,
  ...envelope,
  ...role,
  ...place,
  ...form,
  ...task,
  ...pdfSplitter,
  ...context,
  ...attachment,
  ...agent,
  ...submission,
  ...checklist,
  ...listing,
  ...offer
}
