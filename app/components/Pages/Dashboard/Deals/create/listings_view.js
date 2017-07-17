import React from 'react'
import _ from 'underscore'
import listingsHelper from '../../../../../utils/listing'

export default ({
  params,
  listings,
  onPlaceSelect
}) => {

  if (params.type !== 'offer') {
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
            <div
              key={`PLACE_${key}`}
              className="item listing"
              onClick={() => onPlaceSelect(item)}
            >
              <img
                src={item.image || '/static/images/deals/home.svg'}
                className="listing-image"
              />

              <span
                className="status"
                style={{ backgroundColor: listingsHelper.getStatusColorClass(item.status) }}
              >
                { item.status }
              </span>

              <div style={{ color: '#5b6469' }}>
                {c.street_number} {c.street_name} {c.street_suffix}
              </div>

              <div style={{ color: '#a0a0a0' }}>
                { c.city }, {c.state}, {c.postal_code}, ${item.price}
              </div>
            </div>
          )
        })
        .value()
      }
    </div>
  )
}
