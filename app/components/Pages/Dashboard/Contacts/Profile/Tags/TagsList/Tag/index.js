import React from 'react'
import PropTypes from 'prop-types'

import { grey } from '../../../../../../../../views/utils/colors'

Tag.propTypes = {
  text: PropTypes.string.isRequired
}

export function Tag(props) {
  return (
    <div
      style={{
        padding: '0.5em 1em',
        margin: '0 0.5em 0.5em 0',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        borderRadius: '3px',
        backgroundColor: grey.A100
      }}
    >
      {props.text}
    </div>
  )
}
