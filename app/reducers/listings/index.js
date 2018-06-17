import { combineReducers } from 'redux'
import {
  byIdWithFollow,
  info,
  allIds,
  isFetching,
  errorMessage
} from './shared'

const listings = combineReducers({
  byId: byIdWithFollow,
  info,
  allIds,
  isFetching,
  errorMessage
})

export default listings

export const selectListings = state => state.allIds.map(id => state.byId[id])

export const selectListing = (state, id) => state.byId[id]

export const getFetchingStatus = state => state.isFetching

export const getErrorMessage = state => state.errorMessage

export const getListingsInfo = state => state.info
