import React from 'react'

import listingsHelper from '../../../../utils/listing'
import {
  ListItem,
  ListItemImage,
  ListItemAddress,
  ListItemStatus,
  AddressContainer,
  Status,
  Address,
  IconContainer
} from './styled'
import IconHome from '../../SvgIcons/NewHome/IconHome'

export default ({ item, ...rest }) => {
  const address = item.address_components

  return (
    <ListItem {...rest}>
      <AddressContainer>
        {item.image ? (
          <ListItemImage alt="" src={item.image} />
        ) : (
          <IconContainer center>
            <IconHome />
          </IconContainer>
        )}
        <ListItemAddress>
          <Address style={{ fontWeight: '500' }}>
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
