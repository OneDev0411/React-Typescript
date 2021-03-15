import React from 'react'
import PropTypes from 'prop-types'

import { Box } from '@material-ui/core'

import { mdiCog } from '@mdi/js'

import Spinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import { ScrollableArea } from 'components/ScrollableArea'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import FlowItem from '../FlowItem'
import { List, Container, EmptyContainer, SettingLink } from './styled'

ListView.propTypes = {
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
          <SvgIcon path={mdiCog} size={muiIconSizes.small} />
          <span>Manage Flows</span>
        </SettingLink>
      </Box>
    </Container>
  )
}
