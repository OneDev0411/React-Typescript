import { useState } from 'react'

import { changeUrl } from '@app/utils/change-url'
import { ListingDetailsModal } from '@app/views/components/ListingDetailsModal'
import TableColumnProperty, {
  TableColumnPropertyProps
} from '@app/views/components/TableColumnProperty'

interface ListingsListColumnPropertyProps
  extends Omit<TableColumnPropertyProps, 'children'> {
  listingId: UUID
}

function ListingsListColumnProperty({
  listingId,
  ...otherProps
}: ListingsListColumnPropertyProps) {
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = () => {
    window.history.back()
    setIsOpen(false)
  }

  const openModal = () => {
    changeUrl(`/dashboard/mls/${listingId}`)
    setIsOpen(true)
  }

  return (
    <>
      <TableColumnProperty {...otherProps} onClick={openModal} />
      <ListingDetailsModal
        isOpen={isOpen}
        listingId={listingId}
        closeHandler={closeModal}
      />
    </>
  )
}

export default ListingsListColumnProperty
