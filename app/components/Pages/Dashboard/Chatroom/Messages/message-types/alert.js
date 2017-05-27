import React from 'react'
import moment from 'moment'

export default ({
  alert
}) => {
  return (
    <div className="message-item alert">
      Created an alert: { alert.title ? alert.title : alert.proposed_title }
      <div>
        <img src="/static/images/dashboard/mls/map-tile.jpg" />
      </div>

      <div>
        We'll keep you updated with new listings
      </div>
    </div>
  )
}
