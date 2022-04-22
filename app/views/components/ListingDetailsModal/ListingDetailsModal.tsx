import { noop } from '@app/utils/helpers'

import InlineDialog from '../InlineDialog'
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
  return (
    <InlineDialog
      open={isOpen}
      // in widget mode we don't have app sidebar
      // in all dashboard pages leftOffset === appSidenavWidth
      leftOffset={isWidget ? 0 : undefined}
      data-test="listing-details-modal"
    >
      {listingId && (
        <>
          <ListingDetails
            isModal
            isWidget={isWidget}
            id={listingId}
            onClose={closeHandler}
            onToggleFavorite={onToggleFavorite}
          />
        </>
      )}
    </InlineDialog>
  )
}

export default ListingDetailsModal
