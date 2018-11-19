import React from 'react'
import PropTypes from 'prop-types'

import StarIcon from 'components/SvgIcons/Star/StarIcon'
import Tooltip from 'components/tooltip'

PrimaryStar.propTypes = {
  style: PropTypes.shape()
}

PrimaryStar.defaultProps = {
  style: {}
}

export function PrimaryStar(props) {
  return (
    <Tooltip caption="Primary">
      <StarIcon
        style={{
          fill: '#f5a623',
          width: '1em',
          height: '1em',
          ...props.style
        }}
      />
    </Tooltip>
  )
}
