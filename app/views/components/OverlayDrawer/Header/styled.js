import styled from 'styled-components'
import { merriweatherFamilyStyle } from '../../Typography/styles'
import { borderColor } from '../../../utils/colors'

export const Container = styled.div`
  height: 56px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 1.5rem;
  border-bottom: 1px solid ${borderColor};
  background-color: #ffffff;
  z-index: 1;
`

export const Title = styled.h2`
  ${merriweatherFamilyStyle};
  font-weight: 900;
  font-size: 1.5rem;
`
