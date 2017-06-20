import React from 'react'
import Brand from '../../../../../controllers/Brand'

const Loading = ({ text }) =>
  <div className="c-loading--text">
    <div
      className="c-loading--text__inner"
      style={{ backgroundColor: `#${Brand.color('primary', '3388ff')}` }}>
      Loading {text} Listings...
    </div>
  </div>

export default Loading
