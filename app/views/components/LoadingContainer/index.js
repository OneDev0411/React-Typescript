import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { primary } from 'views/utils/colors'
import Spinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

LoadingContainer.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  title: PropTypes.string,
  style: PropTypes.shape()
}

LoadingContainer.defaultProps = {
  className: '',
  color: primary,
  size: '6em',
  title: '',
  style: { padding: '50% 0' }
}

export default function LoadingContainer({ color, size, title, ...props }) {
  return (
    <Flex center column {...props}>
      <Spinner style={{ width: size, height: size }} fillColor={color} />
      {title}
    </Flex>
  )
}
