import * as agent from './agent'
import * as checklist from './checklist'
import * as context from './context'
import * as deal from './deal'
import * as envelope from './envelope'
import * as file from './file'
import * as form from './form'
import * as contextHelpers from './helpers/context'
import * as uploadHelpers from './helpers/upload'
import * as listing from './listing'
import * as notification from './notification'
import * as role from './role'
import * as splitter from './splitter'
import * as submission from './submission'
import * as task from './task'

export default {
  get: {
    // eslint-disable-next-line import/namespace
    status: contextHelpers.getStatus,
    field: contextHelpers.getField
  },
  upload: {
    ...uploadHelpers
  },
  ...agent,
  ...checklist,
  ...context,
  ...deal,
  ...envelope,
  ...file,
  ...form,
  ...listing,
  ...notification,
  ...role,
  ...splitter,
  ...submission,
  ...task
}
