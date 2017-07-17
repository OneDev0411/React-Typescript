import React from 'react'

export default ({
  places,
  onPlaceSelect
}) => (
  <div>
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
