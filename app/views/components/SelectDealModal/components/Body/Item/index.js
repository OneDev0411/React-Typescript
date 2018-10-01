import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { getStatusColor } from '../../../../../../utils/listing'
import * as Deal from '../../../../../../models/Deal/context-helper'

const Container = styled.div`
  display: flex;
  padding: 0.5em 1em;
  background-color: ${props => (props.isHighlighted ? '#f2f2f2' : '#fff')};

  &:hover {
    cursor: pointer;
  }
`

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
      <div style={{ width: '32px', height: '32px', borderRadius: '50%' }}>
        <img src={getPhoto(item)} alt="home" style={{ width: '100%' }} />
      </div>
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
