import React from 'react'
import _ from 'underscore'

export default ({
  places,
  onPlaceSelect
}) => {

  if (_.size(places) === 0) {
    return false
  }

  return (
    <div>
      <p>
        <span className="title">Places</span>
        <img
          src="/static/images/deals/google.png"
          style={{ height: '20px', float: 'right' }}
        />
      </p>

      {
        _.map(places, (item, key) => (
          <div
            key={`PLACE_${key}`}
            className="item"
            onClick={() => onPlaceSelect(item)}
          >
            { item.full_address }
          </div>
        ))
      }
    </div>
  )
}
