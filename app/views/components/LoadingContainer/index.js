import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { primary } from 'views/utils/colors'
import Spinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

LoadingContainer.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  style: PropTypes.shape()
}

LoadingContainer.defaultProps = {
  className: '',
  color: primary,
  size: '6em',
  style: { padding: '50% 0' }
}

export default function LoadingContainer({ color, size, ...props }) {
  return (
    <Flex center {...props}>
      <Spinner style={{ width: size, height: size }} fillColor={color} />
    </Flex>
  )
}
