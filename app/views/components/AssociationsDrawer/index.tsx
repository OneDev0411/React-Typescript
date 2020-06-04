import React from 'react'

import Drawer from 'components/OverlayDrawer'
import { AssociationItem } from 'components/AssocationItem'

interface Props {
  associations: ICRMTaskAssociation<CRMTaskAssociationType>[]
  isOpen: boolean
  onClose: () => void
  onDelete?: () => void
  isRemovable?: boolean
  title?: string
}

AssociationsDrawer.defaultProps = {
  title: 'All Associations'
}

export default function AssociationsDrawer({
  associations,
  isOpen,
  onClose,
  onDelete,
  isRemovable = false,
  title
}: Props) {
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <Drawer.Header title={title} />
      <Drawer.Body style={{ padding: '1.5rem 1rem 1.5rem 1.5rem' }}>
        {associations.map(association => (
          <AssociationItem
            association={association}
            key={association.id}
            isRemovable={isRemovable}
            handleRemove={onDelete}
          />
        ))}
      </Drawer.Body>
    </Drawer>
  )
}
