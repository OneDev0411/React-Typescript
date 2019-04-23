import styled from 'styled-components'

import { merriweatherFamilyStyle } from '../../Typography/styles'
import { borderColor } from '../../../utils/colors'

export const Container = styled.div`
  height: 4.5rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 1.5rem;
  background-color: #fff;
  z-index: 2;

  & .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    width: 100%;
  }

  &:after {
    border-bottom: 1px solid ${borderColor};
    display: block;
    content: '';
  }
`

export const Title = styled.h2`
  ${merriweatherFamilyStyle};
  font-weight: 700;
  font-size: 1.25rem;
`
