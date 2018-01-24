import { batchActions } from 'redux-batched-actions'
import store from '../../../app/stores'
import {
  setTasks,
  setDeals,
  setChecklists,
  setRoles
} from '../../../app/store_actions/deals'
import normalizedDeals from './get-normalized-deals'

export default function () {
  batchActions([
    store.dispatch(setTasks(normalizedDeals.tasks)),
    store.dispatch(setChecklists(normalizedDeals.checklists)),
    store.dispatch(setRoles(normalizedDeals.roles)),
    store.dispatch(setDeals(normalizedDeals.deals))
  ])
}
