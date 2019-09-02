import React from 'react'

import Drawer from 'components/OverlayDrawer'
import { AssociationItem } from 'components/AssocationItem'

interface Props {
  associations: ICRMTaskAssociation<CRMTaskAssociationType>[]
  isOpen: boolean
  onClose: () => void
  title?: string
}

AssociationsDrawer.defaultProps = {
  title: 'All Associations'
}

export default function AssociationsDrawer(props: Props) {
  return (
    <Drawer open={props.isOpen} onClose={props.onClose}>
      <Drawer.Header title={props.title} />
      <Drawer.Body style={{ padding: '1.5rem 1rem 1.5rem 1.5rem' }}>
        {props.associations.map(association => (
          <AssociationItem
            association={association}
            key={association.id}
            isRemovable={false}
          />
        ))}
      </Drawer.Body>
    </Drawer>
  )
}
