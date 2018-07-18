import React, { Fragment } from 'react'

import listingsHelper from '../../../../utils/listing'

import {
  ListItem,
  ListItemImage,
  ListItemAddress,
  ListItemStatus,
  Status,
  Address
} from './styled'

export default ({ listings, onSelectListing }) => {
  if (!listings || listings.length === 0) {
    return false
  }

  // These filters list suggested in here: web#1028
  const filteredItems = listings.filter(
    item =>
      item.is_mls_search ||
      item.status.includes('Active') ||
      ['Pending', 'Leased'].includes(item.status)
  )

  return (
    <Fragment>
      {filteredItems.map((item, key) => {
        const c = item.address_components

        return (
          <ListItem key={key} onClick={() => onSelectListing(item)}>
            <ListItemImage
              alt=""
              src={item.image || '/static/images/deals/home.svg'}
            />

            <ListItemAddress>
              <Address style={{ color: '#5b6469', fontWeight: '500' }}>
                {c.street_number} {c.street_name} {c.street_suffix}
                {c.unit_number ? ` Unit ${c.unit_number}` : ''}
              </Address>

              <Address style={{ color: '#a0a0a0' }}>
                {c.city}, {c.state}, {c.postal_code}, ${item.price}
              </Address>
            </ListItemAddress>

            <ListItemStatus>
              <Status
                style={{
                  backgroundColor: listingsHelper.getStatusColorClass(
                    item.status
                  )
                }}
              >
                {item.status}
              </Status>
            </ListItemStatus>
          </ListItem>
        )
      })}
    </Fragment>
  )
}
