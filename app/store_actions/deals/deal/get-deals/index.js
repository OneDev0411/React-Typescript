import { normalize } from 'normalizr'
import { batchActions } from 'redux-batched-actions'

import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

import { setTasks } from '../../task'
import { setChecklists } from '../../checklist'
import { setRoles } from '../../role'
import * as schema from '../../schema'

export function getDeals(user) {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.SET_FETCHING_STATUS,
        status: true
      })

      const data = await Deal.getAll(user)

      if (data.length === 0) {
        return dispatch({ type: actionTypes.NO_DEAL })
      }

      const { entities } = normalize(data, schema.dealsSchema)
      const { deals, roles, checklists, tasks } = entities

      batchActions([
        dispatch(setTasks(tasks)),
        dispatch(setChecklists(checklists)),
        dispatch(setRoles(roles)),
        dispatch(setDeals(deals))
      ])
    } catch (e) {
      dispatch({
        type: actionTypes.GET_DEALS_FAILED,
        name: 'get-deals',
        message: e.response ? e.response.body.message : null
      })
    } finally {
      dispatch({
        type: actionTypes.SET_FETCHING_STATUS,
        status: false
      })
    }
  }
}
