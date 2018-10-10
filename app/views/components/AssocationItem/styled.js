import styled from 'styled-components'

import { grey } from '../../utils/colors'
import { merriweatherFamilyStyle } from '../Typography/styles'

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 0.5em 0.5em 0;
  padding: 0.5em;
  border-radius: 3px;
  background-color: ${grey.A100};

  &:hover {
    cursor: pointer;
    background-color: ${grey.A250};
  }
`

export const Title = styled.div`
  ${merriweatherFamilyStyle};
  font-size: 0.875rem;
`

export const Details = styled.div`
  font-size: 0.875rem;
  color: ${grey.A900};
`
