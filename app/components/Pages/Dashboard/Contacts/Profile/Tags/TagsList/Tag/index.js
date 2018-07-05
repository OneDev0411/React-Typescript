import React from 'react'
import PropTypes from 'prop-types'

Tag.propTypes = {
  text: PropTypes.string.isRequired
}

export function Tag(props) {
  return (
    <div
      style={{
        padding: '0.5em 1em',
        margin: '0 1em 1em 0',
        lineHeight: 1,
        borderRadius: '3px',
        border: 'solid 1px #d4dfe6'
      }}
    >
      {props.text}
    </div>
  )
}
