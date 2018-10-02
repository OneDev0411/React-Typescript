import React from 'react'
import PropTypes from 'prop-types'

Subtitle.propTypes = {
  style: PropTypes.shape()
}

Subtitle.defaultProps = {
  style: {}
}

export function Subtitle(props) {
  return (
    <div style={{ marginTop: '1em', color: '#8a8a8a', ...props.style }}>
      {props.children}
    </div>
  )
}
