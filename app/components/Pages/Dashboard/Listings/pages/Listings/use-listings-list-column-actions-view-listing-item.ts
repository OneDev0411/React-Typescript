import { useState } from 'react'

import { changeUrl } from '@app/utils/change-url'

interface UseListingsListColumnActionsViewListingItemReturn {
  isListingModalOpen: boolean
  viewListingLabel: string
  openListingsModal: (listingId: UUID) => void
  closeListingsModal: () => void
}

// eslint-disable-next-line max-len
function useListingsListColumnActionsViewListingItem(): UseListingsListColumnActionsViewListingItemReturn {
  const [isListingModalOpen, setIsListingsModalOpen] = useState(false)
  const viewListingLabel = 'View Listing'

  const openListingsModal = (listingId: UUID) => {
    changeUrl(`/dashboard/mls/${listingId}`)
    setIsListingsModalOpen(true)
  }

  const closeListingsModal = () => {
    window.history.back()
    setIsListingsModalOpen(false)
  }

  return {
    isListingModalOpen,
    viewListingLabel,
    openListingsModal,
    closeListingsModal
  }
}

export default useListingsListColumnActionsViewListingItem
