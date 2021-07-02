import { List, ListItem } from '@material-ui/core'

import { OpenHouseDrawer } from '@app/views/components/open-house/OpenHouseDrawer'
import { ListingDetailsModal } from '@app/views/components/ListingDetailsModal'

import MoreActionsButton, {
  MoreActionsButtonProps
} from '@app/views/components/MoreActionsButton'

import useListingsListColumnActionsOpenHouseItem from './use-listings-list-column-actions-open-house-item'
import useListingsListColumnActionsViewListingItem from './use-listings-list-column-actions-view-listing-item'
import { ListingRow } from './types'

export interface ListingsListColumnActionsMoreButtonProps
  extends Omit<
    MoreActionsButtonProps,
    'disablePortal' | 'popperPlacement' | 'RenderMenu'
  > {
  row: ListingRow
}

function ListingsListColumnActionsMoreButton({
  row,
  ...otherProps
}: ListingsListColumnActionsMoreButtonProps) {
  const {
    isListingModalOpen,
    viewListingLabel,
    openListingsModal,
    closeListingsModal
  } = useListingsListColumnActionsViewListingItem()

  const {
    openHouseLabel,
    hasOpenHouseItem,
    openHouse,
    isOpenHouseDrawerOpen,
    openOpenHouseDrawer,
    closeOpenHouseDrawer,
    handleOpenHouseDelete
  } = useListingsListColumnActionsOpenHouseItem(row.id)

  return (
    <>
      <MoreActionsButton
        {...otherProps}
        disablePortal
        popperPlacement="bottom-end"
        RenderMenu={({ closeMenu }) => (
          <List dense>
            <ListItem
              button
              onClick={event => {
                openListingsModal()
                closeMenu(event)
              }}
            >
              {viewListingLabel}
            </ListItem>
            {hasOpenHouseItem && (
              <ListItem
                button
                onClick={event => {
                  openOpenHouseDrawer()
                  closeMenu(event)
                }}
              >
                {openHouseLabel}
              </ListItem>
            )}
          </List>
        )}
      />
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

export default ListingsListColumnActionsMoreButton
