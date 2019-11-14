import { combineReducers } from 'redux'

import { attributeDefs, IAttributeDefsState } from './attributeDefs'
import list from './list'
import tags from './tags'
import spinner from './spinner'
import importOutlook from './importOutlook'
import importCsv from './importCsv'
import { contactsFilterSegments } from '../filter-segments'
import { oAuthAccounts } from './oAuthAccounts'
import { IOauthAccountsState } from './oAuthAccounts/types'

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
