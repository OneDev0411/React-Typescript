import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { getStatusColor } from '../../../../../../../../utils/listing'
import * as Deal from '../../../../../../../../models/Deal/context-helper'

const Container = styled.div`
  display: flex;
  margin-bottom: 1em;

  &:last-of-type {
    margin: 0;
  }

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
  onClick: PropTypes.func.isRequired
}

export function Item(props) {
  const { item, onClick } = props
  const status = Deal.getStatus(item) || 'Unknown'
  const dealSide = Deal.getSide(item)
  const address = Deal.getAddress(item)

  return (
    <Container {...props} onClick={() => onClick(item)}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
        <img src={getPhoto(item)} alt="home" style={{ width: '100%' }} />
      </div>
      <div style={{ paddingLeft: '2rem' }}>
        <Flex alignCenter style={{ marginBottom: '0.5em' }}>
          <Price>{getPrice(item)}</Price>
          <Status status={status}>{status}</Status>
        </Flex>
        {dealSide ||
          (address && (
            <div style={{ color: '#758a9e' }}>
              {dealSide && (
                <div>
                  <b>{dealSide}</b>
                </div>
              )}
              {address && <div>{address}</div>}
            </div>
          ))}
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

  return Deal.getFormattedPrice(price) || '$0'
}
