import React from 'react'
import fecha from 'fecha'
import Flex from 'styled-flex-component'

import { getStatusColorClass, getListingAddressObj } from 'utils/listing'

import IconDrag from 'components/SvgIcons/Drag/IconDrag'
import IconHome from 'components/SvgIcons/NewHome/IconHome'
import IconDelete from 'components/SvgIcons/Close/CloseIcon'

import {
  ListItem,
  ListItemImage,
  ListItemAddress,
  ListItemStatus,
  AddressContainer,
  Status,
  Address,
  IconContainer
} from '../styled'

export function MlsItem({ item, ...props }) {
  const address = getListingAddressObj(item)

  const getStatus = () => {
    const { status, close_date } = item

    if ((status === 'Sold' || status === 'Leased') && close_date) {
      return `${status} ${fecha.format(
        new Date(close_date * 1000),
        'mediumDate'
      )}`
    }

    return status
  }

  return (
    <ListItem {...props} className="c-search-listings__mls-item">
      {props.isDraggable && <IconDrag style={{ marginRight: '0.5rem' }} />}

      <Flex style={{ width: '100%' }} justifyBetween alignCenter>
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
              {address.city}, {address.state}, {address.postal_code}, $
              {item.price}
            </Address>
          </ListItemAddress>
        </AddressContainer>

        <ListItemStatus>
          <Status
            style={{
              backgroundColor: getStatusColorClass(item.status)
            }}
          >
            {getStatus()}
          </Status>

          {props.removable && (
            <IconDelete className="delete-icon" onClick={props.onClickRemove} />
          )}
        </ListItemStatus>
      </Flex>
    </ListItem>
  )
}
