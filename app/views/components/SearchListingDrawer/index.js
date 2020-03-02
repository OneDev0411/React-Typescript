import React from 'react'
import PropTypes from 'prop-types'
import _ from 'underscore'
import Flex from 'styled-flex-component'
import { Button, Tooltip } from '@material-ui/core'

import { searchListings } from 'models/Deal/listing'

import Listing from '../../../models/listings/listing'
import { attachDealDataToListing } from './helpers/attach-deal-to-listing'

import SearchDrawer from '../SearchDrawer'
import ListingItem from './ListingItem'
import getMockListing from './helpers/get-mock-listing'
import getMockPlaceholderListing from './helpers/get-mock-placeholder-listing'

class SearchListingDrawer extends React.Component {
  state = {
    isWorking: false
  }

  handleSelectListings = async items => {
    const { onSelect } = this.props

    if (onSelect) {
      return onSelect(Object.values(items))
    }

    const { mockListings } = this.props

    this.setState({
      isWorking: true
    })

    try {
      const mockedMLSData = mockListings ? await getMockListing() : null

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

      this.props.onSelectListingsCallback(listings)
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
    let response = await searchListings(value)

    if (/^[0-9]{5,8}$/.test(value)) {
      response = [
        {
          ...response.property,
          is_mls_search: true,
          id: response.id,
          price: response.price,
          status: response.status,
          cover_image_url: response.cover_image_url
        }
      ]
    }

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
        forceRenderFooter={this.props.allowSkip}
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
        renderAction={
          this.props.allowSkip
            ? props => (
                <Flex>
                  <Tooltip
                    placement="left"
                    title="Skip if not able to find it on MLS"
                  >
                    <Button
                      variant="outlined"
                      color="default"
                      style={{
                        marginRight: '0.5rem'
                      }}
                      onClick={async () => {
                        const placeholderListing = await getMockPlaceholderListing()

                        this.handleSelectListings([placeholderListing])
                      }}
                    >
                      Skip
                    </Button>
                  </Tooltip>
                  {this.props.multipleSelection &&
                    this.props.renderAction(props)}
                </Flex>
              )
            : this.props.renderAction
        }
      />
    )
  }
}

SearchListingDrawer.propTypes = {
  searchPlaceholder: PropTypes.string,
  mockListings: PropTypes.bool,
  allowedStatuses: PropTypes.array,
  title: PropTypes.string,
  defaultListTitle: PropTypes.string,
  allowSkip: PropTypes.bool
}

SearchListingDrawer.defaultProps = {
  searchPlaceholder: 'Enter MLS # or address',
  mockListings: false,
  allowedStatuses: [],
  title: 'Select a Listing',
  defaultListTitle: 'Add from your deals',
  allowSkip: false
}

export default SearchListingDrawer
