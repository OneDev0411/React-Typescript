import { normalize } from 'normalizr'
import { batchActions } from 'redux-batched-actions'
import types from '../../constants/deals'
import Deal from '../../models/Deal'
import { appendChecklist, setChecklists, setTasks } from './deal'
import * as schema from './schema'

function update(id, checklist) {
  return {
    type: types.UPDATE_CHECKLIST,
    id,
    checklist
  }
}

export function updateChecklist(dealId, checklistId, attributes) {
  return async (dispatch) => {
    await Deal.updateChecklist(dealId, checklistId, attributes)
    dispatch(update(checklistId, attributes))
  }
}

export function addContract(dealId, name, order, isBackup, propertyType) {
  return async (dispatch) => {
    const data = await Deal.addContract(dealId, name, order, isBackup, propertyType)

    const { entities } = normalize(data, schema.checklistSchema)
    const { checklists, tasks } = entities
    const checklistId = Object.keys(checklists)[0]

    batchActions([
      dispatch(setTasks(tasks)),
      dispatch(setChecklists(checklists)),
      dispatch(appendChecklist(dealId, checklistId))
    ])
  }
}
