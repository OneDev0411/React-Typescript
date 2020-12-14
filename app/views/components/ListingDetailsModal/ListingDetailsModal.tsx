import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import { useTheme, Theme } from '@material-ui/core/styles'

import { ListingDetails } from '../ListingDetails'

interface Props {
  listingId: UUID
  isOpen: boolean
  closeHandler: () => void
}

function ListingDetailsModal({ listingId, isOpen, closeHandler }: Props) {
  const theme: Theme = useTheme()

  return (
    <Dialog open={isOpen} fullScreen style={{ zIndex: theme.zIndex.modal + 1 }}>
      <ListingDetails id={listingId} onClose={closeHandler} />
    </Dialog>
  )
}

export default ListingDetailsModal
