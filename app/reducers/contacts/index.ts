import { combineReducers } from 'redux'

import { attributeDefs, IAttributeDefsState } from './attributeDefs'
import list from './list'
import tags from './tags'
import spinner from './spinner'
import importOutlook from './importOutlook'
import importCsv from './importCsv'
import { contactsFilterSegments } from '../filter-segments'
import { IOauthAccountsState, oAuthAccounts } from './oAuthAccounts'

export interface IContactReduxState {
  oAuthAccounts: IOauthAccountsState
  attributeDefs: IAttributeDefsState
  tags: any // TODO(type): add type definitions
  list: IContactReduxListState
  filterSegments: IContactReduxFilterSegmentState
}

export default combineReducers<IContactReduxState>({
  attributeDefs,
  list,
  tags,
  spinner,
  importOutlook,
  importCsv,
  oAuthAccounts,
  filterSegments: contactsFilterSegments
})
