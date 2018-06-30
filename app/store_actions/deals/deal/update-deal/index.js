import { normalize } from 'normalizr'
import { batchActions } from 'redux-batched-actions'

import { setTasks } from '../../task'
import { setChecklists } from '../../checklist'
import { setRoles } from '../../role'
import { setEnvelopes } from '../../envelope'

import * as actionTypes from '../../../../constants/deals'
import * as schema from '../../schema'

export function updateDeal(deal) {
  return async dispatch => {
    const { entities } = normalize(deal, schema.dealSchema)
    const { deals, roles, envelopes, checklists, tasks } = entities

    batchActions([
      dispatch(setTasks(tasks)),
      dispatch(setChecklists(checklists)),
      dispatch(setRoles(roles)),
      dispatch(setEnvelopes(envelopes)),
      dispatch({
        type: actionTypes.UPDATE_DEAL,
        deal: deals[deal.id]
      })
    ])
  }
}
