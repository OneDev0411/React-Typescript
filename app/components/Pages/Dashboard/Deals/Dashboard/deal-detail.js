import React from 'react'
import S from 'shorti'
import Avatar from 'react-avatar'
import { Row, Col } from 'react-bootstrap'
import { getFieldValue } from '../../../../../utils/helpers'

const getFullAddress = (deal) => {
  const city = getFieldValue(deal, 'city')
  const state = getFieldValue(deal, 'state')
  const postal_code = getFieldValue(deal, 'postal_code')
  return `${city}, ${state}, ${postal_code}`.replace(/-,/ig, '')
}

const getPrice = (deal) => {
  const price = getFieldValue(deal, 'list_price')

  if (!price)
    return '-'

  const humanizedPrice =
    price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return `$${humanizedPrice}`
}

export default ({
  deal
}) => (
  <div className="sidebar">
    <Row>
      <Col xs={8}>
        <div className="street">
          { getFieldValue(deal, 'street_address') || '-' }
        </div>
        <div className="address">
          { getFullAddress(deal) }
        </div>
      </Col>

      <Col xs={4}>
        <img
          style={S('mr-10 w-40 br-2')}
          src={
            getFieldValue(deal, 'photo')
            || '/static/images/deals/home.svg'
          }
        />
      </Col>
    </Row>

    <div className="hr" />

    <div className="item">
      <span>Status: </span>
      <span>
        { getFieldValue(deal, 'listing_status') || 'Coming Soon' }
      </span>
    </div>

    <div className="item">
      <span>Price: </span>
      <span>{ getPrice(deal) }</span>
    </div>

    <div className="hr" />

    {
      deal.roles && deal.roles.map(role => (
        <Row
          key={`ROLE_${role.id}`}
          style={S('mb-15')}
        >
          <Col xs={8}>
            <div>{ role.user.display_name }</div>
            <div style={{ color: 'gray' }}>{ role.role }</div>
          </Col>

          <Col xs={4}>
            <Avatar
              round
              name={role.user.display_name}
              src={role.user.profile_image_url}
              size={35}
            />
          </Col>
        </Row>
      ))
    }

  </div>
)
