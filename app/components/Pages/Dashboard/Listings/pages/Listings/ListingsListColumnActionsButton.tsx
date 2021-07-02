import { List, ListItem } from '@material-ui/core'

import SplitButton from '@app/views/components/SplitButton'
import { OpenHouseDrawer } from '@app/views/components/open-house/OpenHouseDrawer'
import { ListingDetailsModal } from '@app/views/components/ListingDetailsModal'

import useListingsListColumnActionsOpenHouseItem from './use-listings-list-column-actions-open-house-item'
import useListingsListColumnActionsViewListingItem from './use-listings-list-column-actions-view-listing-item'
import useListingsListColumnActionsDealItem from './use-listings-list-column-actions-deal-item'
import { ListingRow } from './types'

export interface ListingsListColumnActionsButtonProps {
  row: ListingRow
  hasActions: boolean
}

function ListingsListColumnActionsButton({
  hasActions,
  row
}: ListingsListColumnActionsButtonProps) {
  const {
    openHouseLabel,
    hasOpenHouseItem,
    openHouse,
    isOpenHouseDrawerOpen,
    openOpenHouseDrawer,
    closeOpenHouseDrawer,
    handleOpenHouseDelete
  } = useListingsListColumnActionsOpenHouseItem(row.id)

  const {
    isListingModalOpen,
    viewListingLabel,
    openListingsModal,
    closeListingsModal
  } = useListingsListColumnActionsViewListingItem()

  const {
    gotoDeal,
    dealLabel,
    hasDealButton
  } = useListingsListColumnActionsDealItem(row.id, hasActions)

  const handleClick = () => {
    if (hasDealButton) {
      gotoDeal()
    } else if (hasOpenHouseItem) {
      openOpenHouseDrawer()
    } else {
      openListingsModal()
    }
  }

  const getLabel = () => {
    if (hasDealButton) {
      return dealLabel
    }

    if (hasOpenHouseItem) {
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
        disablePortal
        renderMenu={({ closeMenu }) => (
          <List dense>
            {hasDealButton && hasOpenHouseItem && (
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
            {(hasDealButton || hasOpenHouseItem) && (
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
      {hasOpenHouseItem && isOpenHouseDrawerOpen && (
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
        listingId={row.id}
        closeHandler={closeListingsModal}
      />
    </>
  )
}

export default ListingsListColumnActionsButton
