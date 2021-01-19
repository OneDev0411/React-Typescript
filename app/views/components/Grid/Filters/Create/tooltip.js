import React from 'react'
import styled from 'styled-components'

import { Tooltip } from '@material-ui/core'

const Title = styled.div`
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 8px;
`

const Text = styled.div`
  font-size: 14px;
`

const customStyle = { textAlign: 'left', padding: '8px 0' }

export const FilterItemTooltip = ({ item, children }) => (
  <Tooltip
    placement="right"
    title={
      <div style={customStyle}>
        <Title>{item.label}</Title>
        <Text>{item.tooltip}</Text>
      </div>
    }
  >
    {children}
  </Tooltip>
)

export const MissingValueTooltip = ({ enabled, children }) => (
  <Tooltip
    title={
      enabled && (
        <div style={customStyle}>
          <Title>You have missed a filter</Title>
          <Text>
            One of your filters is missing a value.
            <br /> Finish editing that before adding a new one.
          </Text>
        </div>
      )
    }
  >
    {children}
  </Tooltip>
)
