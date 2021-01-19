import React, { useState } from 'react'
import { Box, Typography } from '@material-ui/core'

import Modal from 'components/BareModal'
import PageHeader from 'components/PageHeader'
import LoadingContainer from 'components/LoadingContainer'
import ListingCard from 'components/ListingCards/ListingCard'
import { ListingDetailsModal } from 'components/ListingDetailsModal'

import { formatListing } from '../../helpers/format-listing'

import { Card } from './styled'

interface Props {
  isLoading: boolean
  isOpen: boolean
  onClose: () => void
  feed: any[]
}

export default function AlertViewerModal(props: Props) {
  const pageTitle = 'Shared Listings'
  const { isOpen, onClose, feed } = props
  const [
    selectedListing,
    setSelectedListing
  ] = useState<ICompactListing | null>(null)
  const [showListingModal, setShowListingModal] = useState(false)

  if (!isOpen) {
    return null
  }

  const renderContent = () => {
    if (props.isLoading) {
      return <LoadingContainer style={{ padding: '20vh 0' }} />
    }

    if (feed.length > 0) {
      return (
        <Box display="flex" flexWrap="wrap" px={3}>
          {feed.map(listing => (
            <Card key={listing.id}>
              <ListingCard
                listing={formatListing(listing)}
                onClick={() => {
                  setSelectedListing(listing)
                  setShowListingModal(true)
                }}
              />
            </Card>
          ))}
        </Box>
      )
    }

    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h3">No Listings</Typography>
      </Box>
    )
  }

  const feedLength = feed.length > 0 ? `(${feed.length})` : ''

  return (
    <Modal
      className="c-full-screen-modal"
      contentLabel={pageTitle}
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <PageHeader
        onClickCloseButton={onClose}
        title={`${pageTitle}${feedLength}`}
      />
      {renderContent()}

      {showListingModal && selectedListing && (
        <ListingDetailsModal
          isOpen
          listingId={selectedListing.id}
          closeHandler={() => setShowListingModal(false)}
        />
      )}
    </Modal>
  )
}
