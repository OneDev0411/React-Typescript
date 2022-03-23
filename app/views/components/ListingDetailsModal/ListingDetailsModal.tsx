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
    <InlineDialog open={isOpen} data-test="listing-details-modal">
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
    </InlineDialog>
  )
}

export default ListingDetailsModal
