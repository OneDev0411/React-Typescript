import { Button, ButtonProps } from '@material-ui/core'

import { useState } from 'react'

import { OpenHouseDrawer } from '@app/views/components/open-house/OpenHouseDrawer'

import { ListingRow } from './types'

import useListingsOpenHouseIsLoading from './use-listings-open-house-is-loading'
import useListingsOpenHouseReload from './use-listings-open-house-reload'
import useListingsOpenHouseRow from './use-listings-open-house-row'

export interface ListingsListColumnActionsOpenHouseButtonProps
  extends Omit<ButtonProps, 'children'> {
  row: ListingRow
}

function ListingsListColumnActionsOpenHouseButton({
  row,
  ...otherProps
}: ListingsListColumnActionsOpenHouseButtonProps) {
  const isLoading = useListingsOpenHouseIsLoading()
  const reload = useListingsOpenHouseReload()
  const openHouse = useListingsOpenHouseRow(row.id)

  const [open, setOpen] = useState(false)

  const openDrawer = () => setOpen(true)

  const closeDrawer = () => setOpen(false)

  const handleDelete = () => {
    closeDrawer()
    reload()
  }

  if (isLoading) {
    return null
  }

  return (
    <>
      <Button {...otherProps} onClick={openDrawer}>
        OH Registration Page
      </Button>
      {open && (
        <OpenHouseDrawer
          deleteCallback={handleDelete}
          isOpen
          onClose={closeDrawer}
          openHouse={openHouse}
          submitCallback={handleDelete}
          associations={{ listing: row }}
        />
      )}
    </>
  )
}

export default ListingsListColumnActionsOpenHouseButton
