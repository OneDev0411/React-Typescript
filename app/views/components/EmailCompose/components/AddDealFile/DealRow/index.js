import React from 'react'

import { getSide } from 'models/Deal/helpers/context'

import { Avatar } from 'components/GeneralAvatar'

import { Container } from 'components/SelectContactModal/components/ContactItem'

import { Address, Details } from './styled'

export function DealRow({
  item,
  status,
  getAvatarProps,
  getPrice,
  onClickHandler,
  ...rest
}) {
  return (
    <Container {...rest} onClick={() => onClickHandler(item)}>
      <Avatar {...getAvatarProps(item)} />
      <div style={{ paddingLeft: '1em' }}>
        <Address>{item.title}</Address>
        <Details style={{ marginRight: '0.5em' }}>
          {status || 'Draft'} . {getSide(item)} . {item.property_type}
        </Details>
      </div>
    </Container>
  )
}
