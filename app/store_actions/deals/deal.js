import { normalize } from 'normalizr'
import { batchActions } from 'redux-batched-actions'
import * as actionTypes from '../../constants/deals'
import Deal from '../../models/Deal'
import * as schema from './schema'
import { setTasks } from './task'
import { setChecklists } from './checklist'
import { setRoles } from './role'
import { setEnvelopes } from './envelope'
import { addNotification as notify } from 'reapop'

export function setDeals(deals) {
  return {
    type: actionTypes.GET_DEALS,
    deals
  }
}

function addNewDeal(deal) {
  return {
    type: actionTypes.CREATE_DEAL,
    deal
  }
}

function dealUpdated(deal) {
  return {
    type: actionTypes.UPDATE_DEAL,
    deal
  }
}

export function setFetchingStatus(status) {
  return {
    type: actionTypes.SET_FETCHING_STATUS,
    status
  }
}

export function dealArchived(deal_id) {
  return {
    type: actionTypes.ARCHIVE_DEAL,
    deal_id
  }
}

export function updateDealNotifications(deal_id, count) {
  return {
    type: actionTypes.UPDATE_NOTIFICATIONS,
    deal_id,
    count
  }
}

export function appendChecklist(deal_id, checklist_id) {
  return {
    type: actionTypes.APPEND_CHECKLIST,
    deal_id,
    checklist_id
  }
}

export function archiveDeal(dealId) {
  return async dispatch => {
    await Deal.archiveDeal(dealId)
    dispatch(dealArchived(dealId))
  }
}

export function updateListing(dealId, listingId) {
  return async dispatch => {
    const deal = await Deal.updateListing(dealId, listingId)

    dispatch(updateDeal(deal))
  }
}

export function updateDeal(deal) {
  return async dispatch => {
    const { entities } = normalize(deal, schema.dealSchema)
    const { deals, roles, envelopes, checklists, tasks } = entities

    batchActions([
      dispatch(setTasks(tasks)),
      dispatch(setChecklists(checklists)),
      dispatch(setRoles(roles)),
      dispatch(setEnvelopes(envelopes)),
      dispatch(dealUpdated(deals[deal.id]))
    ])
  }
}

export function createDeal(deal) {
  return async dispatch => {
    const { entities } = normalize(deal, schema.dealSchema)
    const { deals, roles, checklists, tasks } = entities

    batchActions([
      dispatch(setTasks(tasks)),
      dispatch(setChecklists(checklists)),
      dispatch(setRoles(roles)),
      dispatch(addNewDeal(deals[deal.id]))
    ])
  }
}

export function getDeal(deal_id) {
  return async dispatch => {
    try {
      const deal = await Deal.getById(deal_id)

      dispatch(updateDeal(deal))
    } catch (e) {
      dispatch(
        notify({
          title: e.message,
          message:
            e.response && e.response.body ? e.response.body.message : null,
          status: 'error'
        })
      )

      throw e
    }
  }
}

export function getDeals(user) {
  return async dispatch => {
    try {
      dispatch(setFetchingStatus(true))

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
      dispatch(setFetchingStatus(false))
    }
  }
}

export function searchDeals(user, value) {
  return async dispatch => {
    try {
      batchActions([
        dispatch(setFetchingStatus(true)),
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
      dispatch(
        notify({
          title: 'Server Error',
          message:
            e.response && e.response.body ? e.response.body.message : null,
          status: 'error'
        })
      )
    } finally {
      dispatch(setFetchingStatus(false))
    }
  }
}

// export function searchAllDeals(query, isBackOffice = false) {
//   return async dispatch => {
//     try {
//       dispatch({ type: actionTypes.SHOW_SPINNER })

//       const data = await Deal.searchAllDeals(query, isBackOffice)

//       dispatch({ type: actionTypes.HIDE_SPINNER })

//       if (data.length === 0) {
//         dispatch(addSearchedDeals({}))
//       }

//       const { entities } = normalize(data, schema.dealsSchema)
//       const { deals, roles, checklists, tasks } = entities

//       batchActions([
//         dispatch(setTasks(tasks)),
//         dispatch(setChecklists(checklists)),
//         dispatch(setRoles(roles)),
//         dispatch(addSearchedDeals(deals))
//       ])
//     } catch (e) {
//       batchActions([
//         dispatch({ type: actionTypes.HIDE_SPINNER }),
//         dispatch(cleanSearchedDeals()),
//         dispatch(
//           notify({
//             title: 'Server Error',
//             message:
//               e.response && e.response.body ? e.response.body.message : null,
//             status: 'error'
//           })
//         )
//       ])
//     }
//   }
// }
