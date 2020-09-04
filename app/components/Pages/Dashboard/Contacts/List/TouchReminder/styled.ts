import styled from 'styled-components'

import { borderColor, primary } from 'views/utils/colors'

export const Container = styled.div`
  display: flex;
  align-items: center;
`

interface LabelProps {
  bold?: boolean
}

export const Label = styled.label<LabelProps>`
  font-size: 1rem;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  margin: 0;
`

export const Input = styled.input`
  outline: none;
  border: none;
  border-bottom: 1px solid ${borderColor};
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  color: ${primary};
  width: 3rem;
  margin: 0 0.5rem;
`
