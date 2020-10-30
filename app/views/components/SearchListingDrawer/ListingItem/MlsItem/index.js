import React from 'react'
import fecha from 'fecha'
import Flex from 'styled-flex-component'
import { mdiHomeOutline, mdiDrag, mdiClose } from '@mdi/js'

import {
  addressTitle,
  getListingAddressObj,
  getStatusColorClass
} from 'utils/listing'
import { grey } from 'views/utils/colors'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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

  const address = getListingAddressObj(item)

  if (!address) {
    return null
  }

  return (
    <ListItem {...props} className="c-search-listings__mls-item">
      {props.isDraggable && <SvgIcon path={mdiDrag} rightMargined />}

      <Flex style={{ width: '100%' }} justifyBetween alignCenter>
        <AddressContainer>
          {item.cover_image_url ? (
            <ListItemImage alt="" src={item.cover_image_url} />
          ) : (
            <IconContainer center>
              <SvgIcon path={mdiHomeOutline} />
            </IconContainer>
          )}
          <ListItemAddress>
            <Address style={{ fontWeight: '500' }}>
              {typeof address === 'string' ? address : addressTitle(address)}
            </Address>

            <Address style={{ color: grey.A550 }}>
              {typeof address === 'object' && (
                <>
                  {address.city}, {address.state}, {address.postal_code},
                </>
              )}{' '}
              ${item.price.toLocaleString()}
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
            <SvgIcon
              path={mdiClose}
              className="delete-icon"
              onClick={props.onClickRemove}
            />
          )}
        </ListItemStatus>
      </Flex>
    </ListItem>
  )
}
