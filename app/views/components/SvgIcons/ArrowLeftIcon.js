import React from 'react'
import PropTypes from 'prop-types'

const defaultProps = {
  size: 24
}

const propTypes = {
  size: PropTypes.number,
  color: PropTypes.string.isRequired
}

function ArrowLeftIcon({ color, size }) {
  return (
    <svg
      fill={color}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
      <path d="M0-.5h24v24H0z" fill="none" />
    </svg>
  )
}

ArrowLeftIcon.propTypes = propTypes
ArrowLeftIcon.defaultProps = defaultProps

export default ArrowLeftIcon
