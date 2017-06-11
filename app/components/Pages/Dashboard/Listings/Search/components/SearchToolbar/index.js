import React from 'react'
import SearchBox from './SearchBox'
import StatusBar from './StatusBar'
import DrawingButton from './DrawingButton'

const SearchToolbar = () => (
  <div className="c-mls-toolbar">
    <SearchBox />
    <DrawingButton />
    <StatusBar />
  </div>
)

export default SearchToolbar