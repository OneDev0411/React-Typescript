import React from 'react'

const SearchPinMarker = ({
    lat,
    lng
}) => (
  <div
    lat={lat}
    lng={lng}
  >
    <img
      style={{ height: '36px' }}
      src="/static/images/dashboard/mls/map-pin.svg"
    />
  </div>
)

export default SearchPinMarker