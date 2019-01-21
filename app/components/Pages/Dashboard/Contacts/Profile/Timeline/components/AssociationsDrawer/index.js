import React from 'react'
import PropTypes from 'prop-types'

import Drawer from 'components/OverlayDrawer'
import { AssociationItem } from 'components/AssocationItem'

AssociationsDrawer.propTypes = {
  ...Drawer.propTypes,
  defaultAssociationId: PropTypes.string.isRequired,
  associations: PropTypes.arrayOf(PropTypes.shape()).isRequired
}

AssociationsDrawer.defaultProps = Drawer.defaultProps

export function AssociationsDrawer(props) {
  return (
    <Drawer isOpen={props.isOpen} onClose={props.onClose} showFooter={false}>
      <Drawer.Header title="All Associations" />
      <Drawer.Body style={{ padding: '6.5rem 1rem 1.5rem 1.5rem' }}>
        {props.associations.map((association, index) => (
          <AssociationItem
            association={association}
            key={`association_${index}`}
            isRemovable={false}
            isReadOnly={
              props.defaultAssociationId ===
              association[association.association_type].id
            }
          />
        ))}
      </Drawer.Body>
    </Drawer>
  )
}
