import { normalize } from 'normalizr'
import { batch } from 'react-redux'

import Deal from '../../../../models/Deal'
import { appendChecklist } from '../../deal/append-checklist'
import * as schema from '../../schema'
import { setTasks } from '../../task'
import { setChecklists } from '../set-checklist'

export function createOffer(deal, conditions) {
  return async dispatch => {
    const checklist = await Deal.createOffer(deal, conditions)

    const { entities } = normalize(checklist, schema.checklistSchema)
    const { checklists, tasks } = entities
    const checklistId = Object.keys(checklists)[0]

    batch(() => {
      dispatch(setTasks(tasks))
      dispatch(setChecklists(checklists))
      dispatch(appendChecklist(deal.id, checklistId))
    })

    return checklist
  }
}
