import { useContext, useState } from 'react'

import {
  makeStyles,
  Button,
  Tooltip,
  Box,
  Fade,
  Typography
} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'
import { HipPocketListingDrawer } from 'components/HipPocketListing'
import { searchListings } from 'models/Deal/listing'
import { getMediaGallery } from 'models/Deal/media-manager'

import Listing from '../../../models/listings/listing'
import SearchDrawer from '../SearchDrawer'

import { convertHipPocketListingToListing } from './helpers/convert-hip-pocket-listing-to-listing'
import ListingItem from './ListingItem'

const useStyles = makeStyles(
  theme => ({
    alertAction: {
      alignItems: 'flex-start',
      marginTop: theme.spacing(0.5)
    }
  }),
  { name: 'SearchListingDrawer' }
)

export default function SearchListingDrawer(props) {
  const {
    searchPlaceholder = 'Enter MLS # or address',
    allowHipPocket = false,
    withMlsDisclaimer = false,
    allowedStatuses = [],
    title = 'Select a Listing',
    defaultLists = [],
    multipleSelection = false,
    defaultSelectedItems = {},
    renderAction,
    onSelect,
    onClose,
    onHipPocketImageUpload,
    onSelectListingsCallback
  } = props

  const classes = useStyles()

  const confirmation = useContext(ConfirmationModalContext)
  const [state, setState] = useState({
    selectedItems: defaultSelectedItems,
    isWorking: false,
    isHipPocketListingDrawerOpen: false,
    isMlsDisclaimerOpen: true
  })

  const handleSelectListings = async items => {
    if (onSelect) {
      return onSelect(Object.values(items))
    }

    setState(oldState => ({ ...oldState, isWorking: true }))

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

      onSelectListingsCallback(listings)
    } catch (e) {
      console.log(e)
    } finally {
      setState(oldState => ({ ...oldState, isWorking: false }))
    }
  }

  const normalizeSelectedItem = item => ({
    ...item,
    id: item.type === 'deal' && item.listing ? item.listing : item.id
  })

  const searchListing = async value => {
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
      if (item.is_mls_search || !allowedStatuses.length) {
        return true
      }

      return allowedStatuses.includes(item.status)
    })
  }

  const openHipPocketListingDrawer = () => {
    setState(oldState => ({ ...oldState, isHipPocketListingDrawerOpen: true }))
  }

  const closeHipPocketListingDrawer = () => {
    setState(oldState => ({ ...oldState, isHipPocketListingDrawerOpen: false }))
  }

  const handleSaveHipPocketListing = async data => {
    const listingData = convertHipPocketListingToListing(data)

    if (multipleSelection) {
      setState(oldState => ({
        selectedItems: {
          ...oldState.selectedItems,
          [listingData.id]: listingData
        }
      }))
    } else {
      handleSelectListings([listingData])
    }

    closeHipPocketListingDrawer()
  }

  const onChangeSelectedItems = newItems => {
    setState(oldState => ({ ...oldState, selectedItems: newItems }))
  }

  const onSelectDealWithNoListing = () => {
    confirmation.setConfirmationModal({
      message: 'There are no listings connected.',
      description:
        'There are no listings associated with this deal in the market (MLS). You can input information manually as an off-market listing or you can cancel and search a listing.',
      confirmLabel: 'off-market (Input Manually)',
      needsCancel: true,
      onConfirm: () => {
        openHipPocketListingDrawer()
      }
    })
  }

  return (
    <>
      <SearchDrawer
        forceRenderFooter={allowHipPocket}
        title={title}
        showLoadingIndicator={state.isWorking}
        multipleSelection={multipleSelection}
        searchInputOptions={{
          placeholder: searchPlaceholder,
          debounceTime: 700,
          minimumLength: 3
        }}
        onChangeSelectedItems={onChangeSelectedItems}
        onSelectDealWithNoListing={onSelectDealWithNoListing}
        selectedItems={state.selectedItems}
        defaultLists={defaultLists}
        ItemRow={ListingItem}
        normalizeSelectedItem={normalizeSelectedItem}
        searchFunction={searchListing}
        onSelectItems={handleSelectListings}
        {...props}
        onClose={() => {
          onClose()

          if (withMlsDisclaimer) {
            setState(oldState => ({ ...oldState, isMlsDisclaimerOpen: true }))
          }
        }}
        renderSearchNotices={
          withMlsDisclaimer
            ? () => (
                <Fade unmountOnExit in={state.isMlsDisclaimerOpen}>
                  <Box mb={2}>
                    <Alert
                      severity="warning"
                      variant="outlined"
                      classes={{
                        action: classes.alertAction
                      }}
                      onClose={() => {
                        setState(oldState => ({
                          ...oldState,
                          isMlsDisclaimerOpen: false
                        }))
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
          allowHipPocket
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
                      onClick={openHipPocketListingDrawer}
                    >
                      Off Market (Input Manually)
                    </Button>
                  </Tooltip>
                  {renderAction && renderAction(props)}
                </Flex>
              )
            : renderAction
        }
      />
      <HipPocketListingDrawer
        isOpen={state.isHipPocketListingDrawerOpen}
        onClose={closeHipPocketListingDrawer}
        onSave={handleSaveHipPocketListing}
        onImageUpload={onHipPocketImageUpload}
      />
    </>
  )
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
