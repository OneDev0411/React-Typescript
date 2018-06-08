import { combineReducers } from 'redux'
import { attributeDefs } from './attributeDefs'
import list from './list'
import tags from './tags'
import spinner from './spinner'
import contact from './contact'
import activities from './activities'
import importOutlook from './importOutlook'
import importCsv from './importCsv'
import { contactsFilterSegments } from '../filter-segments'

export default combineReducers({
  attributeDefs,
  list,
  tags,
  spinner,
  contact,
  activities,
  importOutlook,
  importCsv,
  filterSegments: contactsFilterSegments
})
