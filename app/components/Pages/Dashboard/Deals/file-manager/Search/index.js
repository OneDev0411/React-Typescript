import React from 'react'
import styled from 'styled-components'

import Search from 'views/components/Grid/Search'

const SearchContainer = styled.div`
  margin-bottom: 40px;
`

let persistentSearchInput = ''
export function SearchFiles(props) {
  return (
    <SearchContainer>
      <Search
        disableOnSearch={false}
        showLoadingOnSearch
        isSearching={props.isSearching}
        placeholder="Search all uploaded files in this deal…"
        onChange={props.onSearch}
        debounceTime={100}
        minimumLength={1}
        defaultValue={persistentSearchInput}
        onClearSearch={props.onSearch}
      />
    </SearchContainer>
  )
}
