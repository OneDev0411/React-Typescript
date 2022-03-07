import { normalize } from 'normalizr'
import { batch } from 'react-redux'

import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'
import { setChecklists } from '../../checklist/set-checklist'
import { setRoles } from '../../role'
import * as schema from '../../schema'
import { setTasks } from '../../task'
import { setDeals } from '../set-deals'

export function getDeals(team) {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.SET_FETCHING_STATUS,
        status: true
      })

      const data = await Deal.getAll(team)

      if (data.length === 0) {
        return dispatch({ type: actionTypes.NO_DEAL })
      }

      const { entities } = normalize(data, schema.dealsSchema)
      const { deals, roles, checklists, tasks } = entities

      batch(() => {
        dispatch(setTasks(tasks))
        dispatch(setChecklists(checklists))
        dispatch(setRoles(roles))
        dispatch(setDeals(deals))
      })
    } catch (e) {
      console.log(e)
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
