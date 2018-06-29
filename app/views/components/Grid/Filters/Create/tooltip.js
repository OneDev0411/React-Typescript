import React from 'react'
import styled from 'styled-components'
import ToolTip from '../../../tooltip'

const Container = styled.div`
  position: relative;
  min-width: 200px;
  text-align: left !important;
  margin-left: -20px;
  background-color: ${props => (props.error ? '#fd3a57' : '#465a71')};
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 4px;
  &:after {
    right: 100%;
    top: 50%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(70, 90, 113, 0);
    border-right-color: ${props => (props.error ? '#fd3a57' : '#465a71')};
    border-width: 8px;
    margin-top: -8px;
  }
`

const Title = styled.div`
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.4px;
  color: #fff;
  margin-bottom: 10px;
`

const Text = styled.div`
  font-size: 14px;
  line-height: 1.43;
  color: #fff;
`

export const FilterItemToolTip = ({ item, children }) => (
  <ToolTip
    captionIsHTML
    tooltipStyles={{
      textAlign: 'left'
    }}
    caption={
      <Container>
        <Title>{item.label}</Title>
        <Text>{item.tooltip}</Text>
      </Container>
    }
    placement="right"
  >
    {children}
  </ToolTip>
)

export const MissingValueToolTip = ({ enabled, children }) => (
  <ToolTip
    captionIsHTML
    tooltipStyles={{
      textAlign: 'left'
    }}
    caption={
      enabled && (
        <Container error>
          <Title>You have missed a filter</Title>
          <Text>
            One of your filters is missing a value.<br /> Finish editing that
            before adding a new one.
          </Text>
        </Container>
      )
    }
    placement="right"
  >
    {children}
  </ToolTip>
)
