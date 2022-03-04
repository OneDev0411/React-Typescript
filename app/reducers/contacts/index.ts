import { combineReducers } from 'redux'

import { contactsFilterSegments } from '../filter-segments'

import { attributeDefs, IAttributeDefsState } from './attributeDefs'
import importOutlook from './importOutlook'
import list from './list'
import { oAuthAccounts } from './oAuthAccounts'
import { IOauthAccountsState } from './oAuthAccounts/types'
import spinner from './spinner'
import tags from './tags'

export interface IContactReduxState {
  oAuthAccounts: IOauthAccountsState
  attributeDefs: IAttributeDefsState
  tags: any // TODO(type): add type definitions
  list: IContactReduxListState
  spinner: boolean
  filterSegments: IContactReduxFilterSegmentState
}

export default combineReducers({
  attributeDefs,
  list,
  tags,
  spinner,
  importOutlook,
  oAuthAccounts,
  filterSegments: contactsFilterSegments
})
