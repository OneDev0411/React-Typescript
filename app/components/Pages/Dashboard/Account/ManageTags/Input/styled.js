import styled from 'styled-components'

import { theme } from '../../../../../../theme'

export const TextInputSuffix = styled.button`
  outline: none;
  border: none;
  background: transparent;
  font-size: 1rem;
  padding: 0 1rem;
  margin: auto;
  color: ${({ disabled }) =>
    disabled ? theme.palette.grey[600] : theme.palette.primary.main};
`

export const TextInputPrefix = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 0.75rem;
`
