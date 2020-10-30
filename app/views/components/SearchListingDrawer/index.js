import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import { Button, Tooltip } from '@material-ui/core'

import { searchListings } from 'models/Deal/listing'
import { getMediaGallery } from 'models/media-manager'

import Listing from '../../../models/listings/listing'
import { attachDealDataToListing } from './helpers/attach-deal-to-listing'

import SearchDrawer from '../SearchDrawer'
import ListingItem from './ListingItem'
import getMockListing from './helpers/get-mock-listing'

class SearchListingDrawer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isWorking: false
    }
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
        Object.keys(items).map(async key => {
          const item = items[key]

          if (item.gallery_image_urls) {
            return item
          }

          let listing = item.id
          const currentDealPhotos = []

          // If a deal is selected
          if (item.type === 'deal') {
            listing = item.listing

            const currentDealGallery = await getMediaGallery(item.id)

            currentDealPhotos.push(
              ...currentDealGallery.map(photo => photo.src)
            )
          }

          // Handle deals without listing, if mockListings is enabled
          if (mockListings && !listing) {
            const mergedDealWithListing = attachDealDataToListing(
              item,
              mockedMLSData
            )

            // Prepend deal photos as listing gallery images
            mergedDealWithListing.gallery_image_urls = [
              ...currentDealPhotos,
              ...mergedDealWithListing.gallery_image_urls
            ]

            return mergedDealWithListing
          }

          const selectedListing = await Listing.getListing(listing)

          // Prepend deal photos as listing gallery images
          selectedListing.gallery_image_urls = [
            ...currentDealPhotos,
            ...selectedListing.gallery_image_urls
          ]

          return selectedListing
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
    // The search listing endpoint does not accept
    // a value with a length of fewer than three characters
    if (value.length < 3) {
      return
    }

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
          debounceTime: 700,
          minimumLength: 3
        }}
        defaultSelectedItems={this.props.defaultSelectedItems}
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
                        const mockListing = await getMockListing()

                        this.handleSelectListings([mockListing])
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
  defaultLists: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      items: PropTypes.array
    })
  ),
  allowSkip: PropTypes.bool
}

SearchListingDrawer.defaultProps = {
  searchPlaceholder: 'Enter MLS # or address',
  mockListings: false,
  allowedStatuses: [],
  title: 'Select a Listing',
  defaultLists: [],
  allowSkip: false
}

export default SearchListingDrawer
