import { normalize } from 'normalizr'
import { batch } from 'react-redux'

import { addNotification as notify } from 'components/notification'

import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'
import { setChecklists } from '../../checklist'
import { setRoles } from '../../role'
import * as schema from '../../schema'
import { setTasks } from '../../task'
import { setDeals } from '../set-deals'

export function searchDeals(team, value) {
  return async dispatch => {
    try {
      batch(() => {
        dispatch({
          type: actionTypes.SET_FETCHING_STATUS,
          status: true
        })
        dispatch({
          type: actionTypes.CLEAR_DEALS
        })
      })

      const data = await Deal.searchDeals(team, value)

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
      dispatch(
        notify({
          title: 'Server Error',
          message:
            e.response && e.response.body
              ? e.response.body.message
              : null ?? 'Something went wrong!',
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
