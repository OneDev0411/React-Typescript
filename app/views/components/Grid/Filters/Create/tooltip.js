import React from 'react'
import styled from 'styled-components'
import ToolTip from '../../../tooltip'

const Title = styled.div`
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 8px;
`

const Text = styled.div`
  font-size: 14px;
`

const customStyle = { textAlign: 'left', padding: '8px 0' }

export const FilterItemToolTip = ({ item, children }) => (
  <ToolTip
    captionIsHTML
    isCustom={false}
    placement="right"
    caption={
      <div style={customStyle}>
        <Title>{item.label}</Title>
        <Text>{item.tooltip}</Text>
      </div>
    }
  >
    {children}
  </ToolTip>
)

export const MissingValueToolTip = ({ enabled, children }) => (
  <ToolTip
    captionIsHTML
    isCustom={false}
    placement="right"
    type="error"
    caption={
      enabled && (
        <div style={customStyle}>
          <Title>You have missed a filter</Title>
          <Text>
            One of your filters is missing a value.<br /> Finish editing that
            before adding a new one.
          </Text>
        </div>
      )
    }
  >
    {children}
  </ToolTip>
)
