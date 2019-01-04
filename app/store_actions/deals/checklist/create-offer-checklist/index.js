import { normalize } from 'normalizr'
import { batchActions } from 'redux-batched-actions'

import Deal from '../../../../models/Deal'
import { appendChecklist } from '../../deal'
import { setTasks } from '../../task'

import { setChecklists } from '..'

import * as schema from '../../schema'

export function createOffer(dealId, name, order, isBackup, propertyType) {
  return async dispatch => {
    const checklist = await Deal.createOffer(
      dealId,
      name,
      order,
      isBackup,
      propertyType
    )

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
