import React from 'react'

import listingsHelper from '../../../../utils/listing'

import {
  ListItem,
  ListItemImage,
  ListItemAddress,
  ListItemStatus,
  AddressContainer,
  Status,
  Address
} from './styled'

export default ({ item, ...rest }) => {
  const address = item.address_components

  return (
    <ListItem {...rest}>
      <AddressContainer>
        <ListItemImage
          alt=""
          src={item.image || '/static/images/deals/home.svg'}
        />

        <ListItemAddress>
          <Address style={{ color: '#5b6469', fontWeight: '500' }}>
            {address.street_number} {address.street_name}{' '}
            {address.street_suffix}
            {address.unit_number ? ` Unit ${address.unit_number}` : ''}
          </Address>

          <Address style={{ color: '#a0a0a0' }}>
            {address.city}, {address.state}, {address.postal_code}, ${
              item.price
            }
          </Address>
        </ListItemAddress>
      </AddressContainer>

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
