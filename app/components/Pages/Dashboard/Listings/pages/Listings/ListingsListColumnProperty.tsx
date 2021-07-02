import { useState } from 'react'

import TableColumnProperty, {
  TableColumnPropertyProps
} from '@app/views/components/TableColumnProperty'

import { ListingDetailsModal } from '@app/views/components/ListingDetailsModal'

interface ListingsListColumnPropertyProps
  extends Omit<TableColumnPropertyProps, 'children'> {
  listingId: UUID
}

function ListingsListColumnProperty({
  listingId,
  ...otherProps
}: ListingsListColumnPropertyProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)

  const closeModal = () => setIsOpen(false)

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
