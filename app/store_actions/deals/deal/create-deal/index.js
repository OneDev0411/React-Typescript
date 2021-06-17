import { normalize } from 'normalizr'
import { batch } from 'react-redux'

import { setTasks } from '../../task'
import { setChecklists } from '../../checklist'
import { setRoles } from '../../role'

import * as schema from '../../schema'
import * as actionTypes from '../../../../constants/deals'

export function createDeal(deal) {
  return dispatch => {
    const { entities } = normalize(deal, schema.dealSchema)
    const { deals, roles, checklists, tasks } = entities

    batch(() => {
      dispatch(setTasks(tasks))
      dispatch(setChecklists(checklists))
      dispatch(setRoles(roles))
      dispatch({
        type: actionTypes.CREATE_DEAL,
        deal: deals[deal.id]
      })
    })
  }
}
