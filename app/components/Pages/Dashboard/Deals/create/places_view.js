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
      {
        _.map(places, (item, key) => (
          <div
            key={`PLACE_${key}`}
            className="item"
            onClick={() => onPlaceSelect(item)}
          >
            { item.full_address }
            <span className="select">Select</span>
          </div>
        ))
      }
    </div>
  )
}
