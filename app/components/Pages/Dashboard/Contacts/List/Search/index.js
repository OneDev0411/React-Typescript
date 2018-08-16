import React from 'react'
import styled from 'styled-components'

import Search from '../../../../../../views/components/Grid/Search'

const SearchContainer = styled.div`
  margin-bottom: 40px;
`

let persistentSearchInput = ''
export class SearchContacts extends React.Component {
  handleSearch = value => {
    // set persistent search input
    persistentSearchInput = value
    this.props.onSearch(value)
  }

  render() {
    return (
      <SearchContainer>
        <Search
          disableOnSearch={false}
          showLoadingOnSearch
          isSearching={this.props.isSearching}
          placeholder="Search all contacts…"
          onChange={this.handleSearch}
          debounceTime={500}
          minimumLength={1}
          // /
          defaultValue={persistentSearchInput}
          onClearSearch={this.handleSearch}
        />
      </SearchContainer>
    )
  }
}
