import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import {
  Button,
  Tooltip,
  Box,
  Fade,
  Typography,
  withStyles
} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'

import { searchListings } from 'models/Deal/listing'
import { getMediaGallery } from 'models/media-manager'

import Listing from '../../../models/listings/listing'
import { attachDealDataToListing } from './helpers/attach-deal-to-listing'

import SearchDrawer from '../SearchDrawer'
import ListingItem from './ListingItem'
import getMockListing from './helpers/get-mock-listing'

const styles = theme => ({
  alertAction: {
    alignItems: 'flex-start',
    marginTop: theme.spacing(0.5)
  }
})

class SearchListingDrawer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isWorking: false,
      isMlsDisclaimerOpen: true
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

          if (item.type === 'listing') {
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
    let response = await searchListings(value)

    // Search value consisting of 5-8 numbers represents an MLS#
    if (/^[0-9]{5,8}$/.test(value)) {
      const modifiedResponse = response.map(item => ({
        ...item.property,
        is_mls_search: true,
        id: item.id,
        price: item.price,
        status: item.status,
        cover_image_url: item.cover_image_url
      }))

      response = modifiedResponse
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
        onClose={() => {
          this.props.onClose()

          if (this.props.withMlsDisclaimer) {
            this.setState({ isMlsDisclaimerOpen: true })
          }
        }}
        renderSearchNotices={
          this.props.withMlsDisclaimer
            ? () => (
                <Fade unmountOnExit in={this.state.isMlsDisclaimerOpen}>
                  <Box mb={2}>
                    <Alert
                      severity="warning"
                      variant="outlined"
                      classes={{
                        action: this.props.classes.alertAction
                      }}
                      onClose={() => {
                        this.setState({ isMlsDisclaimerOpen: false })
                      }}
                    >
                      <AlertTitle>
                        <Typography variant="subtitle1">
                          Important Note
                        </Typography>
                      </AlertTitle>
                      <Typography variant="body2">
                        Some MLS's do not allow agents to promote other agent's
                        listings without their permission. Please make sure you{' '}
                        <strong>
                          only market listings that you have permission for
                        </strong>
                        .
                      </Typography>
                    </Alert>
                  </Box>
                </Fade>
              )
            : undefined
        }
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
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  mockListings: PropTypes.bool,
  multipleSelection: PropTypes.bool,
  allowedStatuses: PropTypes.array,
  withMlsDisclaimer: PropTypes.bool,
  title: PropTypes.string,
  onSelectListingsCallback: PropTypes.func,
  onSelect: PropTypes.func,
  renderAction: PropTypes.func,
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
  withMlsDisclaimer: false,
  allowedStatuses: [],
  title: 'Select a Listing',
  defaultLists: [],
  allowSkip: false,
  multipleSelection: false
}

export default withStyles(styles)(SearchListingDrawer)
