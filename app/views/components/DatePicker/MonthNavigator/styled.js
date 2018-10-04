import styled from 'styled-components'
import { primary } from '../../../utils/colors'

export const Container = styled.div`
  position: absolute;
  right: 0rem;
  top: 4px;
  display: flex;
`

export const Button = styled.span`
  cursor: pointer;
  display: flex;
  svg > path {
    fill: #000000;
  }
  &:hover {
    svg > path {
      fill: ${primary};
    }
  }
`
