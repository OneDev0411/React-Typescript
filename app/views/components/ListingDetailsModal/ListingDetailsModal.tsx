import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import { useTheme, Theme } from '@material-ui/core/styles'

import { ListingDetails } from '../ListingDetails'

interface Props {
  listingId: UUID | null
  isOpen: boolean
  isWidget?: boolean
  closeHandler: () => void
}

function ListingDetailsModal({
  listingId,
  isOpen,
  closeHandler,
  isWidget = false
}: Props) {
  const theme: Theme = useTheme()

  return (
    <Dialog open={isOpen} fullScreen style={{ zIndex: theme.zIndex.modal + 2 }}>
      {listingId && (
        <ListingDetails
          isWidget={isWidget}
          id={listingId}
          onClose={closeHandler}
        />
      )}
    </Dialog>
  )
}

export default ListingDetailsModal
