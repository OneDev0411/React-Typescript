import React from 'react'

import {
  Button,
  Tooltip,
  Box,
  Fade,
  Typography,
  withStyles
} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { HipPocketListingDrawer } from 'components/HipPocketListing'
import { searchListings } from 'models/Deal/listing'
import { getMediaGallery } from 'models/Deal/media-manager'

import Listing from '../../../models/listings/listing'
import SearchDrawer from '../SearchDrawer'

import { convertHipPocketListingToListing } from './helpers/convert-hip-pocket-listing-to-listing'
import ListingItem from './ListingItem'

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
      isHipPocketListingDrawerOpen: false,
      isMlsDisclaimerOpen: true
    }
  }

  handleSelectListings = async items => {
    const { onSelect } = this.props

    if (onSelect) {
      return onSelect(Object.values(items))
    }

    this.setState({
      isWorking: true
    })

    try {
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
        cover_image_url: item.cover_image_url,
        mls_display_name: item.mls_display_name
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

  openHipPocketListingDrawer = () => {
    this.setState({ isHipPocketListingDrawerOpen: true })
  }

  closeHipPocketListingDrawer = () => {
    this.setState({ isHipPocketListingDrawerOpen: false })
  }

  handleClickInputManually = () => {
    this.openHipPocketListingDrawer()
  }

  handleSaveHipPocketListing = async data => {
    const listingData = convertHipPocketListingToListing(data)

    this.closeHipPocketListingDrawer()
    this.handleSelectListings([listingData])
  }

  render() {
    return (
      <>
        <SearchDrawer
          forceRenderFooter={this.props.allowHipPocket}
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
                          Some MLS's do not allow agents to promote other
                          agent's listings without their permission. Please make
                          sure you{' '}
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
            this.props.allowHipPocket
              ? props => (
                  <Flex>
                    <Tooltip
                      placement="left"
                      title="Input your listing data manually, if you can't find it on MLS."
                    >
                      <Button
                        variant="outlined"
                        color="default"
                        style={{
                          marginRight: '0.5rem'
                        }}
                        onClick={this.openHipPocketListingDrawer}
                      >
                        Off Market (Input Manually)
                      </Button>
                    </Tooltip>
                    {this.props.renderAction && this.props.renderAction(props)}
                  </Flex>
                )
              : this.props.renderAction
          }
        />
        <HipPocketListingDrawer
          isOpen={this.state.isHipPocketListingDrawerOpen}
          onClose={this.closeHipPocketListingDrawer}
          onSave={this.handleSaveHipPocketListing}
          onImageUpload={this.props.onHipPocketImageUpload}
        />
      </>
    )
  }
}

SearchListingDrawer.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  allowHipPocket: PropTypes.bool,
  onHipPocketImageUpload: PropTypes.func,
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
  )
}

SearchListingDrawer.defaultProps = {
  searchPlaceholder: 'Enter MLS # or address',
  allowHipPocket: false,
  withMlsDisclaimer: false,
  allowedStatuses: [],
  title: 'Select a Listing',
  defaultLists: [],
  multipleSelection: false
}

export default withStyles(styles)(SearchListingDrawer)
