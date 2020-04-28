import React from 'react'
import PropTypes from 'prop-types'

import { Box } from '@material-ui/core'

import Spinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

import { ScrollableArea } from 'components/ScrollableArea'

import IconCog from 'components/SvgIcons/Cog/IconCog'

import FlowItem from '../FlowItem'
import { List, Container, EmptyContainer, SettingLink } from './styled'

ListView.propTypes = {
  error: PropTypes.string.isRequired,
  flows: PropTypes.shape().isRequired,
  isFetching: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedFlowId: PropTypes.string.isRequired
}

export default function ListView(props) {
  if (props.isFetching) {
    return (
      <EmptyContainer>
        <Spinner />
      </EmptyContainer>
    )
  }

  if (props.error) {
    return (
      <EmptyContainer style={{ color: '#F43B38' }}>
        {props.error}
      </EmptyContainer>
    )
  }

  const items = Object.values(props.flows)

  if (items.length === 0) {
    return <EmptyContainer>No Flow Found!</EmptyContainer>
  }

  return (
    <Container>
      <ScrollableArea hasThinnerScrollbar>
        <List>
          {items.map(flow => (
            <FlowItem
              item={flow}
              key={flow.id}
              onSelect={props.onSelect}
              selected={props.selectedFlowId === flow.id}
            />
          ))}
        </List>
      </ScrollableArea>
      <Box pl={1.5}>
        <SettingLink to="/dashboard/account/flows">
          <IconCog />
          <span>Manage Flows</span>
        </SettingLink>
      </Box>
    </Container>
  )
}
