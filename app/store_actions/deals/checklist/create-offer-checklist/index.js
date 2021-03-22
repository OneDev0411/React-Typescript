import { normalize } from 'normalizr'
import { batchActions } from 'redux-batched-actions'

import Deal from '../../../../models/Deal'
import { appendChecklist } from '../../deal/append-checklist'
import { setTasks } from '../../task'

import { setChecklists } from '../set-checklist'

import * as schema from '../../schema'

export function createOffer(deal, conditions) {
  return async dispatch => {
    const checklist = await Deal.createOffer(deal, conditions)

    const { entities } = normalize(checklist, schema.checklistSchema)
    const { checklists, tasks } = entities
    const checklistId = Object.keys(checklists)[0]

    batchActions([
      dispatch(setTasks(tasks)),
      dispatch(setChecklists(checklists)),
      dispatch(appendChecklist(deal.id, checklistId))
    ])

    return checklist
  }
}
