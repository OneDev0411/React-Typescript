import React from 'react'
import PropTypes from 'prop-types'

const defaultProps = {
  size: 16,
  color: '#000'
}

const propTypes = {
  size: PropTypes.number,
  color: PropTypes.string
}

function TrashIcon({ size, color }) {
  return (
    <svg
      fill={color}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
  )
}

TrashIcon.propTypes = propTypes
TrashIcon.defaultProps = defaultProps

export default TrashIcon
