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
import file from './file'
import agent from './agent'
import submission from './submission'
import checklist from './checklist'
import listing from './listing'
import offer from './offer'
import ejectDraft from './eject-draft'

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
  ...file,
  ...agent,
  ...submission,
  ...checklist,
  ...listing,
  ...offer,
  ...ejectDraft
}
