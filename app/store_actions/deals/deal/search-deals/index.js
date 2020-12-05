import { normalize } from 'normalizr'
import { batchActions } from 'redux-batched-actions'
import { addNotification as notify } from 'components/notification'

import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'
import { setTasks } from '../../task'
import { setChecklists } from '../../checklist'
import { setRoles } from '../../role'
import { setDeals } from '../set-deals'

import * as schema from '../../schema'

export function searchDeals(user, value) {
  return async dispatch => {
    try {
      batchActions([
        dispatch({
          type: actionTypes.SET_FETCHING_STATUS,
          status: true
        }),
        dispatch({
          type: actionTypes.CLEAR_DEALS
        })
      ])

      const data = await Deal.searchDeals(user, value)

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
      console.log(e)
      dispatch(
        notify({
          title: 'Server Error',
          message:
            e.response && e.response.body ? e.response.body.message : null,
          status: 'error'
        })
      )
    } finally {
      dispatch({
        type: actionTypes.SET_FETCHING_STATUS,
        status: false
      })
    }
  }
}
