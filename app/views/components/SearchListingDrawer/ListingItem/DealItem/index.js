import React from 'react'
import { mdiHomeOutline, mdiDrag, mdiClose } from '@mdi/js'

import { Avatar } from 'components/Avatar'
import Deal from 'models/Deal'
import { getStatusColor } from 'utils/listing'

import ActionButton from 'components/Button/ActionButton'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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

export function DealItem({ item: deal, showAddButton, ...props }) {
  const photo = Deal.get.field(deal, 'photo')
  const status = Deal.get.status(deal)

  return (
    <ListItem
      {...props}
      style={{
        justifyContent: 'space-between'
      }}
    >
      <AddressContainer>
        {props.isDraggable && <SvgIcon path={mdiDrag} rightMargined />}

        {photo ? (
          <Avatar
            alt=""
            url={photo}
            showStatus
            statusColor={`#${getStatusColor(status)}`}
          />
        ) : (
          <IconContainer center>
            <SvgIcon path={mdiHomeOutline} />
          </IconContainer>
        )}

        <ListItemAddress>
          <Address style={{ fontWeight: '500' }}>{deal.title}</Address>

          <Address style={{ color: 'rgba(0, 0, 0, 0.5)', fontWeight: '400' }}>
            {status} . {dealSide(deal)} . {deal.property_type}
          </Address>
        </ListItemAddress>
      </AddressContainer>

      {showAddButton && (
        <ActionButton size="small" className="add-item">
          Add
        </ActionButton>
      )}

      {props.removable && (
        <SvgIcon
          path={mdiClose}
          className="delete-icon"
          onClick={props.onClickRemove}
        />
      )}
    </ListItem>
  )
}
