import { Button, ButtonProps } from '@material-ui/core'

import { useState } from 'react'

import { ListingDetailsModal } from '@app/views/components/ListingDetailsModal'

interface ListingsListColumnActionsViewListingButtonProps
  extends Omit<ButtonProps, 'onClick'> {
  listingId: UUID
}

function ListingsListColumnActionsViewListingButton({
  listingId,
  ...otherProps
}: ListingsListColumnActionsViewListingButtonProps) {
  const [open, setOpen] = useState(false)

  const openDialog = () => setOpen(true)

  const closeDialog = () => setOpen(false)

  return (
    <>
      <Button {...otherProps} onClick={openDialog}>
        View Listing
      </Button>
      <ListingDetailsModal
        isOpen={open}
        listingId={listingId}
        closeHandler={closeDialog}
      />
    </>
  )
}

export default ListingsListColumnActionsViewListingButton
