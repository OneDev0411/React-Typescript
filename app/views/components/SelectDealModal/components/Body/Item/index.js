import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { getStatusColor } from '../../../../../../utils/listing'
import * as Deal from '../../../../../../models/Deal/context-helper'

const Container = styled.div`
  height: 48px;
  display: flex;
  padding: 8px 2rem;
  background-color: ${props => (props.isHighlighted ? '#f5f5f5' : '#fff')};

  &:hover {
    cursor: pointer;
  }
`

const Price = styled.b`
  font-size: 1.5rem;
  line-height: 1;
  margin-right: 1em;
  font-weight: bold;
  color: #1e364b;
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
      <div style={{ width: '32px', height: '32px', borderRadius: '50%' }}>
        <img src={getPhoto(item)} alt="home" style={{ width: '100%' }} />
      </div>
      <div style={{ paddingLeft: '2rem', height: '32px' }}>
        <Flex alignCenter>
          <Price>{getPrice(item) || '$0'}</Price>
          <Status status={status}>{status || 'Unknown'}</Status>
        </Flex>
        <Flex alignCenter style={{ color: '#758a9e' }}>
          <b style={{ marginRight: '1em' }}>{Deal.getSide(item)}</b>
          <span>{Deal.getAddress(item)}</span>
        </Flex>
      </div>
    </Container>
  )
}

function getPhoto(deal) {
  return Deal.getField(deal, 'photo') || '/static/images/deals/home.png'
}

function getPrice(deal) {
  const price =
    Deal.getField(deal, 'sales_price') ||
    Deal.getField(deal, 'list_price') ||
    Deal.getField(deal, 'lease_price')

  return Deal.getFormattedPrice(price)
}
