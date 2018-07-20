import React from 'react'

import listingsHelper from '../../../../utils/listing'

import {
  ListItem,
  ListItemImage,
  ListItemAddress,
  ListItemStatus,
  Status,
  Address
} from './styled'

export default ({ item, ...rest }) => {
  const c = item.address_components

  return (
    <ListItem {...rest}>
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
            backgroundColor: listingsHelper.getStatusColorClass(item.status)
          }}
        >
          {item.status}
        </Status>
      </ListItemStatus>
    </ListItem>
  )
}
