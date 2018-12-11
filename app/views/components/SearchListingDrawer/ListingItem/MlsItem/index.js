import React from 'react'
import Flex from 'styled-flex-component'

import listingsHelper from 'utils/listing'

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

export function MlsItem({ item, renderCheckBox, isUpdatingList, ...rest }) {
  const address = item.address_components

  return (
    <ListItem {...rest}>
      {renderCheckBox && renderCheckBox(item)}

      {isUpdatingList && <IconDrag style={{ marginRight: '0.5rem' }} />}

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
              backgroundColor: listingsHelper.getStatusColorClass(item.status)
            }}
          >
            {item.status}
          </Status>

          {isUpdatingList && (
            <IconDelete className="delete-icon" onClick={rest.onClickRemove} />
          )}
        </ListItemStatus>
      </Flex>
    </ListItem>
  )
}
