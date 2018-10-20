import React from 'react'
import styled from 'styled-components'

import { blue, grey } from 'views/utils/colors'
import Checkmark from 'components/SvgIcons/Checkmark/IconCheckmark'

const CheckBox = styled.span`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 3px;
  background-color: ${props => (props.isSelected ? blue.A100 : '#fff')};
  border: solid 1px ${props => (props.isSelected ? blue.A100 : '#000')};
  svg {
    path {
      fill: #ffffff;
    }
  }
  :hover {
    background-color: ${props => (props.isSelected ? blue.A200 : grey.A200)};
    border-color: ${props => (props.isSelected ? blue.A200 : '#000')};
    opacity: ${props => (props.isSelected ? 0.8 : 1)};
  }
`

export const CheckBoxButtonWithoutState = props => (
  <CheckBox
    onClick={props.onClick}
    isSelected={props.isSelected || props.someRowsSelected}
    style={props.style}
  >
    {props.isSelected &&
      (!props.someRowsSelected ? (
        <Checkmark />
      ) : (
        <span
          style={{
            color: '#ffffff',
            marginTop: '-4px',
            fontSize: '1.5rem'
          }}
        >
          -
        </span>
      ))}
  </CheckBox>
)
