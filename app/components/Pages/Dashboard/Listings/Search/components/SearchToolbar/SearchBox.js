import React from 'react'
import Divider from './Divider'
import SearchField from './SearchField'
import FilterButton from './FilterButton'

const SearchBox = () => (
  <div className="c-mls-toolbar__search-box">
    <SearchField />
    <Divider />
    <FilterButton />
  </div>
)

export default SearchBox