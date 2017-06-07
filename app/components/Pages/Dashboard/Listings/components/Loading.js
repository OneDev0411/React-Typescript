import React from 'react'
import Brand from '../../../../../controllers/Brand'

const brandColor = Brand.color('primary', '3388ff')

const Loading = ({ text }) => (
  <div className="c-loading--text">
    <div
      className="c-loading--text__inner"
      style={{ backgroundColor: `#${brandColor}` }}
    >
      Loading {text} Listings...
    </div>
  </div>
)

export default Loading