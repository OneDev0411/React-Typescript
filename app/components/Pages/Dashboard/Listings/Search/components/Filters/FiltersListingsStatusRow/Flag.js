import React from 'react'
import pure from 'recompose/pure'

const Flag = ({ icon, color }) => {
  if (icon) {
    return (
      <span className="c-filters-listings-status__text-icon" style={{ color }}>
        {icon}
      </span>
    )
  }
  return (
    <span
      className="c-filters-listings-status__color"
      style={{ backgroundColor: color }}
    />
  )
}

export default pure(Flag)
