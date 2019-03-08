import React from 'react'
import PropTypes from 'prop-types'

import Spinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { FlowItem } from '../FlowItem'
import { Container, EmptyContainer } from './styled'

ListView.propTypes = {
  error: PropTypes.string.isRequired,
  flows: PropTypes.shape().isRequired,
  isFetching: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedFlowId: PropTypes.string.isRequired
}

export function ListView(props) {
  if (props.isFetching) {
    return (
      <EmptyContainer>
        <Spinner />
      </EmptyContainer>
    )
  }

  if (props.error) {
    return (
      <EmptyContainer style={{ color: 'red' }}>{props.error}</EmptyContainer>
    )
  }

  const items = Object.values(props.flows)

  if (items.length === 0) {
    return <EmptyContainer>No Flow Found!</EmptyContainer>
  }

  return (
    <Container className="u-scrollbar--thinner--self">
      {items.map(flow => (
        <FlowItem
          item={flow}
          key={flow.id}
          onSelect={props.onSelect}
          selected={props.selectedFlowId === flow.id}
        />
      ))}
    </Container>
  )
}
