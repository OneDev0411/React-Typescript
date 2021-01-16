import { normalize } from 'normalizr'
import { batchActions } from 'redux-batched-actions'

import Deal from '../../../../models/Deal'
import { appendChecklist } from '../../deal/append-checklist'
import { setTasks } from '../../task'

import { setChecklists } from '../set-checklist'

import * as schema from '../../schema'

interface Options {
  conditions: {
    deal_type: IDealType
    property_type: IDealPropertyType
  }
}

export function createChecklist(dealId: UUID, options: Options) {
  return async dispatch => {
    const checklist = await Deal.createChecklist(dealId, options)

    const { entities } = normalize(checklist, schema.checklistSchema)
    const { checklists, tasks } = entities
    const checklistId = Object.keys(checklists)[0]

    batchActions([
      dispatch(setTasks(tasks)),
      dispatch(setChecklists(checklists)),
      dispatch(appendChecklist(dealId, checklistId))
    ])

    return checklist
  }
}
