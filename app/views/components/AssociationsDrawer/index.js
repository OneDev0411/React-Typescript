import React from 'react'
import PropTypes from 'prop-types'

import Drawer from '../OverlayDrawer'
import { AssociationItem } from '../AssocationItem'

AssociationsDrawer.propTypes = {
  ...Drawer.propTypes,
  associations: PropTypes.arrayOf(PropTypes.shape()).isRequired
}

AssociationsDrawer.defaultProps = Drawer.defaultProps

export default function AssociationsDrawer(props) {
  return (
    <Drawer isOpen={props.isOpen} onClose={props.onClose} showFooter={false}>
      <Drawer.Header title="All Associations" />
      <Drawer.Body style={{ padding: '6.5rem 1rem 1.5rem 1.5rem' }}>
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
