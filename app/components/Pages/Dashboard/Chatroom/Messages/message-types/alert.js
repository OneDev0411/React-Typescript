import React from 'react'
import moment from 'moment'

export default ({
  alert
}) => {
  return (
    <div className="alert">
      <strong style={{ color: '#9b9a9b' }}>
        Shared a saved search:
      </strong>

      <div>
        <img src="/static/images/dashboard/mls/map-tile.jpg" />
      </div>
    </div>
  )
}
