import React from 'react'
import styled from 'styled-components'

import Search from '../../../../../../views/components/Grid/Search'

const SearchContainer = styled.div`
  margin-bottom: 40px;
`

export function SearchContacts({ onSearch, isSearching }) {
  return (
    <SearchContainer>
      <Search
        disableOnSearch
        showLoadingOnSearch
        isSearching={isSearching}
        placeholder="Search"
        onChange={onSearch}
        debounceTime={500}
        minimumLength={1}
      />
    </SearchContainer>
  )
}
