import React from 'react'
import PropTypes from 'prop-types'

import { Container } from './styled'
import { Name } from '../styled'

FlowItem.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string.isRequired
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool
}

FlowItem.defaultProps = {
  selected: false
}

export function FlowItem(props) {
  const { item } = props

  return (
    <Container
      data-id={item.id}
      onClick={props.onSelect}
      selected={props.selected}
    >
      <Name>{item.name}</Name>
      <div style={{ fontSize: '0.875' }}>{item.description}</div>
    </Container>
  )
}
