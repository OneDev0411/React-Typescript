import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

const Icon = styled.i`
  cursor: pointer;
  font-size: 17px;
  color: #263445;
`

const propTypes = {
  onClick: PropTypes.func
}

const defaultProps = {}

export const Trigger = ({ onClick }) => (
  <Icon className="fa fa-th-list" onClick={onClick} />
)

Trigger.propTypes = propTypes
Trigger.defaultProps = defaultProps
