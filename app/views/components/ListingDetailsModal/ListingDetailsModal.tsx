import React from 'react'

import { Dialog, useTheme, Theme } from '@material-ui/core'

import { noop } from '@app/utils/helpers'

import { ListingDetails } from '../ListingDetails'

interface Props {
  listingId: UUID | null
  isOpen: boolean
  isWidget?: boolean
  closeHandler: () => void
  onToggleFavorite?: () => void
}

function ListingDetailsModal({
  listingId,
  isOpen,
  closeHandler,
  isWidget = false,
  onToggleFavorite = noop
}: Props) {
  const theme: Theme = useTheme()

  return (
    <Dialog
      open={isOpen}
      fullScreen
      scroll="paper"
      data-test="listing-details-modal"
      classes={{
        root: 'u-scrollbar'
      }}
      style={{ zIndex: theme.zIndex.modal + 2 }}
    >
      {listingId && (
        <>
          <ListingDetails
            isWidget={isWidget}
            id={listingId}
            onClose={closeHandler}
            onToggleFavorite={onToggleFavorite}
          />
        </>
      )}
    </Dialog>
  )
}

export default ListingDetailsModal
