import styled from 'styled-components'

import { merriweatherFamilyStyle } from '../../Typography/styles'
import { borderColor } from '../../../utils/colors'

export const Container = styled.div`
  height: 4.5rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 1.5rem;
  border-bottom: 1px solid ${borderColor};
  background-color: #fff;
  z-index: 2;
`

export const Title = styled.h2`
  ${merriweatherFamilyStyle};
  font-weight: 700;
  font-size: 1.25rem;
`
