import { useState } from 'react'

import useListingsOpenHouseHasAccess from './use-listings-open-house-has-access'
import useListingsOpenHouseIsLoading from './use-listings-open-house-is-loading'
import useListingsOpenHouseReload from './use-listings-open-house-reload'
import useListingsOpenHouseRow, {
  UseListingsOpenHouseRowReturn
} from './use-listings-open-house-row'

interface UseListingsListColumnActionsOpenHouseItemReturn {
  openHouseLabel: string
  hasOpenHouseItem: boolean
  openHouse: UseListingsOpenHouseRowReturn
  isOpenHouseDrawerOpen: boolean
  openOpenHouseDrawer: () => void
  closeOpenHouseDrawer: () => void
  handleOpenHouseDelete: () => void
}

function useListingsListColumnActionsOpenHouseItem(
  listingId: UUID
): UseListingsListColumnActionsOpenHouseItemReturn {
  const hasOpenHouseAccess = useListingsOpenHouseHasAccess()
  const isOpenHouseLoading = useListingsOpenHouseIsLoading()
  const reload = useListingsOpenHouseReload()
  const openHouse = useListingsOpenHouseRow(listingId)

  const [isOpenHouseDrawerOpen, setIsOpenHouseDrawerOpen] = useState(false)

  const openHouseLabel = 'OH Registration Page'
  const hasOpenHouseItem = hasOpenHouseAccess && !isOpenHouseLoading

  const openOpenHouseDrawer = () => setIsOpenHouseDrawerOpen(true)

  const closeOpenHouseDrawer = () => setIsOpenHouseDrawerOpen(false)

  const handleOpenHouseDelete = () => {
    closeOpenHouseDrawer()
    reload()
  }

  return {
    openHouseLabel,
    hasOpenHouseItem,
    openHouse,
    isOpenHouseDrawerOpen,
    openOpenHouseDrawer,
    closeOpenHouseDrawer,
    handleOpenHouseDelete
  }
}

export default useListingsListColumnActionsOpenHouseItem
