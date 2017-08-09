import React from 'react'
import _ from 'underscore'
import { Row, Col } from 'react-bootstrap'
import listingsHelper from '../../../../../utils/listing'

export default ({
  type,
  listings,
  onPlaceSelect
}) => {

  if (type !== 'offer') {
    return false
  }

  return (
    <div>
      {
        _.chain(listings)
        .filter(item => {
          return item.status.startsWith('Active') || item.status === 'Pending'
        })
        .map((item, key) => {
          const c = item.address_components
          return (
            <Row
              key={`PLACE_${key}`}
              className="item listing"
              onClick={() => onPlaceSelect(item)}
            >
              <Col md={2} sm={2} xs={2}>
                <img
                  src={item.image || '/static/images/deals/home.svg'}
                  className="listing-image"
                />
              </Col>

              <Col md={6} sm={6} xs={6}>
                <span style={{ color: '#5b6469' }}>
                  {c.street_number} {c.street_name} {c.street_suffix}
                </span>

                <span className="addr">
                  { c.city }, {c.state}, {c.postal_code}, ${item.price}
                </span>
              </Col>

              <Col md={4} sm={4} xs={4}>
                <span
                  className="status"
                  style={{ backgroundColor: listingsHelper.getStatusColorClass(item.status) }}
                >
                  { item.status }
                </span>
              </Col>
            </Row>
          )
        })
        .value()
      }
    </div>
  )
}
