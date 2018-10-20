import styled from 'style-loader'
import Flex from 'styled-flex-component'

import { buttonBaseStyle } from '../styles/ButtonAppearances'

export const isNotDisableState = '&:not([disabled]):'

export const Button = styled.button`
  ${buttonBaseStyle};

  padding: 0;
  margin-left: 8px;
  color: inherit;
  background-color: inherit;

  ${isNotDisableState}hover, ${isNotDisableState}focus {
    color: inherit;
  }
`

export const Box = Flex.extend`
  height: 40px;
  font-size: 16px;
  line-height: 38px;

  color: #000;
  background-color: #f2f2f2;

  &[disabled] {
    opacity: 0.5;
  }

  ${isNotDisableState}hover, ${isNotDisableState}focus {
    background-color: #fff;
    border: 1px solid #000;
  }

  svg {
    width: 24px;
    height: 24px;
    fill: '#000';
  }
`
