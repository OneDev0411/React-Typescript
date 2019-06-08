import React from 'react'
import PropTypes from 'prop-types'
import _ from 'underscore'

import { searchListings } from 'models/Deal/listing'

import Listing from '../../../models/listings/listing'
import { attachDealDataToListing } from './helpers/attach-deal-to-listing'

import SearchDrawer from '../SearchDrawer'
import ListingItem from './ListingItem'

class SearchListingDrawer extends React.Component {
  state = {
    isWorking: false
  }

  handleSelectListings = async items => {
    const { mockListings } = this.props

    this.setState({
      isWorking: true
    })

    try {
      const mockedMLSData = mockListings
        ? await import('./mock_listing.json')
        : null

      const listings = await Promise.all(
        _.map(items, item => {
          if (item.gallery_image_urls) {
            return item
          }

          const listing = item.type === 'deal' ? item.listing : item.id

          if (mockListings && !listing) {
            return attachDealDataToListing(item, mockedMLSData)
          }

          return Listing.getListing(listing)
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
    id: item.type === 'deal' && item.listing ? item.listing : item.id
  })

  searchListing = async value => {
    const response = await searchListings(value)

    return response.filter(item => {
      if (item.is_mls_search || !this.props.allowedStatuses.length) {
        return true
      }

      return this.props.allowedStatuses.includes(item.status)
    })
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
  searchPlaceholder: PropTypes.string,
  mockListings: PropTypes.bool,
  allowedStatuses: PropTypes.array
}

SearchListingDrawer.defaultProps = {
  searchPlaceholder: 'Enter MLS # or address',
  mockListings: false,
  allowedStatuses: []
}

export default SearchListingDrawer
