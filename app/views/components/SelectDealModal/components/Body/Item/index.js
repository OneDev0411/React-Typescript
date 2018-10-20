import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { getStatusColor } from '../../../../../../utils/listing'
import * as Deal from '../../../../../../models/Deal/context-helper'

import Avatar from '../../../../Avatar'
import { Container } from '../../../../SelectContactModal/components/ContactItem'

const Details = styled.span`
  font-size: 0.875rem;
  margin-right: 1rem;
  font-weight: 500;
`

const Status = styled.span`
  line-height: 1;
  color: ${props => `#${getStatusColor(props.status)}`};
`

Item.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isHighlighted: PropTypes.bool.isRequired
}

export function Item(props) {
  const { item, onClickHandler } = props
  const status = Deal.getStatus(item)

  return (
    <Container {...props} onClick={() => onClickHandler(item)}>
      <Avatar {...getAvatarProps(item)} />
      <div style={{ paddingLeft: '1em' }}>
        <Flex alignCenter>
          <Details>{getPrice(item) || '$0'}</Details>
          <Status status={status}>{status || 'Unknown'}</Status>
        </Flex>
        <Flex alignCenter style={{ color: '#7f7f7f' }}>
          <Details style={{ marginRight: '0.5em' }}>
            {Deal.getSide(item)}
          </Details>
          <span>{Deal.getAddress(item)}</span>
        </Flex>
      </div>
    </Container>
  )
}

function getAvatarProps(deal) {
  return {
    size: 40,
    image: Deal.getField(deal, 'photo'),
    placeHolderImage: '/static/icons/associated-deals-place-holder.svg'
  }
}

function getPrice(deal) {
  const price =
    Deal.getField(deal, 'sales_price') ||
    Deal.getField(deal, 'list_price') ||
    Deal.getField(deal, 'lease_price')

  return Deal.getFormattedPrice(price)
}
