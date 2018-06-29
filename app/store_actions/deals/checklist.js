import { normalize } from 'normalizr'
import { batchActions } from 'redux-batched-actions'
import * as actionTypes from '../../constants/deals'
import Deal from '../../models/Deal'
import { appendChecklist } from './deal'
import { setTasks } from './task'
import * as schema from './schema'

export function setChecklists(checklists) {
  return {
    type: actionTypes.GET_CHECKLISTS,
    checklists
  }
}

export function updateChecklist(dealId, checklistId, attributes) {
  return async dispatch => {
    await Deal.updateChecklist(dealId, checklistId, attributes)

    dispatch({
      type: actionTypes.UPDATE_CHECKLIST,
      id: checklistId,
      checklist: attributes
    })
  }
}

export function createOffer(dealId, name, order, isBackup, propertyType) {
  return async dispatch => {
    const data = await Deal.createOffer(
      dealId,
      name,
      order,
      isBackup,
      propertyType
    )

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
