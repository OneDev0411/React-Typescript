import React from 'react'
import PropTypes from 'prop-types'

import { Container, Bar } from './styled'

ProgressBar.propTypes = {
  percents: PropTypes.number.isRequired,
  indeterminate: PropTypes.bool,
  circular: PropTypes.bool,
  style: PropTypes.object
}

ProgressBar.defaultProps = {
  indeterminate: false,
  circular: false,
  style: {}
}

function ProgressBar(props) {
  return (
    <Container style={props.style}>
      <Bar percents={props.percents} indeterminate={props.indeterminate} />
    </Container>
  )
}

export default ProgressBar
