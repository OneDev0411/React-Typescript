import React from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'

import { ListingDetails } from '../ListingDetails'

const useStyles = makeStyles(
  (theme: Theme) => ({
    dialog: { zIndex: theme.zIndex.modal + 2 }
  }),
  { name: 'ListingDetailsModal' }
)

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
  const classes = useStyles()

  return (
    <Dialog
      open={isOpen}
      fullScreen
      className={classes.dialog}
      classes={{
        root: 'u-scrollbar'
      }}
    >
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
