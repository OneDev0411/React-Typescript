import React from 'react'
import PropTypes from 'prop-types'
import _ from 'underscore'

import Deal from '../../../models/Deal'
import Listing from '../../../models/listings/listing'

import SearchDrawer from '../SearchDrawer'
import ListingItem from './ListingItem'

class SearchListingDrawer extends React.Component {
  state = {
    isWorking: false
  }

  handleSelectListings = async items => {
    this.setState({
      isWorking: true
    })

    try {
      const listings = await Promise.all(
        _.map(items, item => {
          if (item.gallery_image_urls) {
            return item
          }

          const id = item.type === 'deal' ? item.listing : item.id

          return Listing.getListing(id)
        })
      )

      this.props.onSelectListings(listings)
    } catch (e) {
      console.log(e)
    } finally {
      this.setState({
        isWorking: false
      })
    }
  }

  normalizeSelectedItem = item => ({
    ...item,
    id: item.type === 'deal' ? item.listing : item.id
  })

  searchListing = async value => {
    const response = await Deal.searchListings(value)

    return response.filter(
      item =>
        item.is_mls_search ||
        ['Pending', 'Leased', 'Active'].includes(item.status)
    )
  }

  render() {
    return (
      <SearchDrawer
        title={this.props.title}
        showLoadingIndicator={this.state.isWorking}
        multipleSelection={this.props.multipleSelection}
        searchInputOptions={{
          placeholder: this.props.searchPlaceholder,
          debounceTime: 500,
          minimumLength: 3
        }}
        ItemRow={ListingItem}
        normalizeSelectedItem={this.normalizeSelectedItem}
        searchFunction={this.searchListing}
        onSelectItems={this.handleSelectListings}
        {...this.props}
      />
    )
  }
}

SearchListingDrawer.propTypes = {
  searchPlaceholder: PropTypes.string
}

SearchListingDrawer.defaultProps = {
  searchPlaceholder: 'Enter MLS # or address'
}

export default SearchListingDrawer
