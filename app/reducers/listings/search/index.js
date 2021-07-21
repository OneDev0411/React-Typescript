import { combineReducers } from 'redux'

import { createNamedWrapperReducer } from '../../../utils/redux-utils'
import listings from '../index.js'
import map from '../map'
import panels from '../panels'

import filters from './filters'
import options from './options'
import { location } from './search-location'
import input from './searchInput'
import type from './searchType'

const search = combineReducers({
  type,
  input,
  filters,
  options,
  location,
  map: createNamedWrapperReducer(map, 'search'),
  panels: createNamedWrapperReducer(panels, 'search'),
  listings: createNamedWrapperReducer(listings, 'search')
})

export default search
