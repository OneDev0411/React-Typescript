import { normalize } from 'normalizr'
import { batch } from 'react-redux'

import Deal from '../../../../models/Deal'
import { appendChecklist } from '../../deal/append-checklist'
import * as schema from '../../schema'
import { setTasks } from '../../task'
import { setChecklists } from '../set-checklist'

interface Options {
  conditions: {
    checklist_type: UUID
    property_type: UUID
  }
}

export function createChecklist(dealId: UUID, options: Options) {
  return async dispatch => {
    const checklist = await Deal.createChecklist(dealId, options)

    const { entities } = normalize(checklist, schema.checklistSchema)
    const { checklists, tasks } = entities
    const checklistId = Object.keys(checklists || {})[0]

    batch(() => {
      dispatch(setTasks(tasks))
      dispatch(setChecklists(checklists))
      dispatch(appendChecklist(dealId, checklistId))
    })

    return checklist
  }
}
