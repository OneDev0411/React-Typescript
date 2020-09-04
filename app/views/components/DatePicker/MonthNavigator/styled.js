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
  margin-left: 0.25rem;
  border-radius: 100%;
  border: 1px solid #b8c4cc;

  &:hover {
    svg {
      color: ${primary};
    }
  }
`
