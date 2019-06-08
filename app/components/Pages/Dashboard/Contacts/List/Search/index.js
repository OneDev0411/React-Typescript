import React from 'react'

import Search from '../../../../../../views/components/Grid/Search'


let persistentSearchInput = ''
export class SearchContacts extends React.Component {
  handleSearch = value => {
    // set persistent search input
    persistentSearchInput = value
    this.props.onSearch(value)
  }

  render() {
    return (
      <div>
        <Search
          disableOnSearch={false}
          isSearching={this.props.isSearching}
          placeholder="Search"
          onChange={this.handleSearch}
          debounceTime={500}
          minimumLength={1}
          defaultValue={persistentSearchInput}
          onClearSearch={this.handleSearch}
        />
      </div>
    )
  }
}
