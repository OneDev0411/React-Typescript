import React from 'react'

import Avatar from 'components/Avatar'
import Deal from 'models/Deal'
import { getStatusColor } from 'utils/listing'

import IconHome from 'components/SvgIcons/NewHome/IconHome'

import {
  ListItem,
  ListItemAddress,
  AddressContainer,
  Address,
  IconContainer
} from '../styled'

function dealSide(deal) {
  return deal.deal_type === 'Selling' ? 'Seller' : 'Buyer'
}

export function DealItem({ item: deal, ...rest }) {
  const photo = Deal.get.field(deal, 'photo')
  const status = Deal.get.status(deal)

  return (
    <ListItem {...rest}>
      <AddressContainer>
        {photo ? (
          <Avatar
            alt=""
            image={photo}
            statusColor={`#${getStatusColor(status)}`}
          />
        ) : (
          <IconContainer center>
            <IconHome />
          </IconContainer>
        )}

        <ListItemAddress>
          <Address style={{ fontWeight: '500' }}>{deal.title}</Address>

          <Address style={{ color: 'rgba(0, 0, 0, 0.5)', fontWeight: '400' }}>
            {status} . {dealSide(deal)} . {deal.property_type}
          </Address>
        </ListItemAddress>
      </AddressContainer>
    </ListItem>
  )
}
