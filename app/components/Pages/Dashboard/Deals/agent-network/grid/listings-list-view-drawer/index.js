import React from 'react'
import PropTypes from 'prop-types'

import Drawer from '../../../../../../../views/components/OverlayDrawer'
import ListingCard from '../../../../../../../views/components/ListingCard'

const propTypes = {
  ...Drawer.propTypes,
  listings: PropTypes.arrayOf(PropTypes.shape()).isRequired
}

export function ListingsListViewDrawer(props) {
  return (
    <Drawer isOpen={props.isOpen} onClose={props.onClose} showFooter={false}>
      <Drawer.Header title={props.title} />
      <Drawer.Body>
        <div style={{ padding: '1.5em' }}>
          {props.listings.map(listing => (
            <ListingCard listing={listing} key={listing.id} />
          ))}
        </div>
      </Drawer.Body>
    </Drawer>
  )
}

ListingsListViewDrawer.propTypes = propTypes
ListingsListViewDrawer.defaultProps = Drawer.defaultProps
