import React from 'react'
import PropTypes from 'prop-types'

const defaultProps = {
  size: 16,
  color: '#000',
  style: {
    display: 'inline-block',
    verticalAlign: 'middle'
  }
}

const propTypes = {
  size: PropTypes.number,
  style: PropTypes.object,
  color: PropTypes.string
}

function AddNote({ size, color, style }) {
  return (
    <svg
      width={size}
      fill={color}
      height={size}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z" />
    </svg>
  )
}

AddNote.propTypes = propTypes
AddNote.defaultProps = defaultProps

export default AddNote
