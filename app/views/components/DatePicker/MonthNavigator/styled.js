import styled from 'styled-components'

import { primary } from '../../../utils/colors'

export const Container = styled.div`
  position: absolute;
  right: 0rem;
  top: 0.3rem;
  display: flex;
  align-items: center;
`

export const Button = styled.span`
  cursor: pointer;
  display: flex;
  background-color: #d5dffe;
  margin-left: 0.25rem;
  border-radius: 100%;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  svg > path {
    fill: #3050f2;
  }

  &:hover {
    svg > path {
      fill: ${primary};
    }
  }
`
