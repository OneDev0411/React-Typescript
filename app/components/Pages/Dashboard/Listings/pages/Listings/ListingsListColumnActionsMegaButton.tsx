import { List, ListItem } from '@material-ui/core'

import { useState } from 'react'

import SplitButton from '@app/views/components/SplitButton'

import { OpenHouseDrawer } from '@app/views/components/open-house/OpenHouseDrawer'
import { goTo } from '@app/utils/go-to'

import { ListingDetailsModal } from '@app/views/components/ListingDetailsModal'

import useListingsOpenHouseIsLoading from './use-listings-open-house-is-loading'
import useListingsOpenHouseReload from './use-listings-open-house-reload'
import useListingsOpenHouseRow from './use-listings-open-house-row'

import useListingsOpenHouseHasAccess from './use-listings-open-house-has-access'
import useListingsFindDealId from './use-listings-find-deal-id'
import { ListingRow } from './types'

export interface ListingsListColumnActionsMegaButtonProps {
  row: ListingRow
  hasActions: boolean
}

// TODO: cleanup this mess

function ListingsListColumnActionsMegaButton({
  hasActions,
  row
}: ListingsListColumnActionsMegaButtonProps) {
  const hasOpenHouseAccess = useListingsOpenHouseHasAccess()
  const listingId = row.id
  const dealId = useListingsFindDealId(listingId)

  // open house
  const isOpenHouseLoading = useListingsOpenHouseIsLoading()
  const reload = useListingsOpenHouseReload()
  const openHouse = useListingsOpenHouseRow(row.id)

  const [isOpenHouseDrawerOpen, setIsOpenHouseDrawerOpen] = useState(false)

  const openOpenHouseDrawer = () => setIsOpenHouseDrawerOpen(true)

  const closeOpenHouseDrawer = () => setIsOpenHouseDrawerOpen(false)

  const handleOpenHouseDelete = () => {
    closeOpenHouseDrawer()
    reload()
  }
  //

  // view listing
  const [isListingModalOpen, setIsListingsModalOpen] = useState(false)

  const openListingsModal = () => setIsListingsModalOpen(true)

  const closeListingsModal = () => setIsListingsModalOpen(false)

  //

  // check buttons access
  const hasDealButton = hasActions
  const hasOpenHouseButton = hasOpenHouseAccess && !isOpenHouseLoading
  //

  const gotoDeal = () =>
    goTo(
      dealId
        ? `/dashboard/deals/${dealId}`
        : `/dashboard/deals/create?listingId=${listingId}`
    )

  const dealLabel = [dealId ? 'View' : 'Create', 'Deal'].join(' ')
  const openHouseLabel = 'OH Registration Page'
  const viewListingLabel = 'View Listing'

  const handleClick = () => {
    if (hasDealButton) {
      gotoDeal()
    } else if (hasOpenHouseButton) {
      openOpenHouseDrawer()
    } else {
      openListingsModal()
    }
  }

  const getLabel = () => {
    if (hasDealButton) {
      return dealLabel
    }

    if (hasOpenHouseButton) {
      return openHouseLabel
    }

    return viewListingLabel
  }

  return (
    <>
      <SplitButton
        color="secondary"
        size="small"
        variant="contained"
        onClick={handleClick}
        renderMenu={({ closeMenu }) => (
          <List dense>
            {hasDealButton && hasOpenHouseButton && (
              <ListItem
                button
                onClick={event => {
                  closeMenu(event)
                  openOpenHouseDrawer()
                }}
              >
                {openHouseLabel}
              </ListItem>
            )}
            {(hasDealButton || hasOpenHouseButton) && (
              <ListItem
                button
                onClick={event => {
                  closeMenu(event)
                  openListingsModal()
                }}
              >
                {viewListingLabel}
              </ListItem>
            )}
            <ListItem
              button
              onClick={event => {
                closeMenu(event)
                alert('The action is not implemented')
              }}
            >
              {/* TODO: Connect this to Mamal's page */}
              Market Listing
            </ListItem>
          </List>
        )}
      >
        {getLabel()}
      </SplitButton>
      {hasOpenHouseButton && isOpenHouseDrawerOpen && (
        <OpenHouseDrawer
          deleteCallback={handleOpenHouseDelete}
          isOpen
          onClose={closeOpenHouseDrawer}
          openHouse={openHouse}
          submitCallback={handleOpenHouseDelete}
          associations={{ listing: row }}
        />
      )}
      <ListingDetailsModal
        isOpen={isListingModalOpen}
        listingId={listingId}
        closeHandler={closeListingsModal}
      />
    </>
  )
}

export default ListingsListColumnActionsMegaButton
