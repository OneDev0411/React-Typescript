import React from 'react'
import SearchBox from './SearchBox'
import StatusBar from './StatusBar'
import DrawingButton from './DrawingButton'
import LocationButton from './LocationButton'

const SearchToolbar = () => (
  <div className="c-mls-toolbar">
    <LocationButton />
    <SearchBox />
    <DrawingButton />
    <LocationButton />
    <StatusBar />
  </div>
)

export default SearchToolbar
