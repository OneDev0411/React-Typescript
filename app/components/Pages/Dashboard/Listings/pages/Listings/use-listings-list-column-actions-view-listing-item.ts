import { useState } from 'react'

interface UseListingsListColumnActionsViewListingItemReturn {
  isListingModalOpen: boolean
  viewListingLabel: string
  openListingsModal: () => void
  closeListingsModal: () => void
}

function useListingsListColumnActionsViewListingItem(): UseListingsListColumnActionsViewListingItemReturn {
  const [isListingModalOpen, setIsListingsModalOpen] = useState(false)
  const viewListingLabel = 'View Listing'

  const openListingsModal = () => setIsListingsModalOpen(true)

  const closeListingsModal = () => setIsListingsModalOpen(false)

  return {
    isListingModalOpen,
    viewListingLabel,
    openListingsModal,
    closeListingsModal
  }
}

export default useListingsListColumnActionsViewListingItem
