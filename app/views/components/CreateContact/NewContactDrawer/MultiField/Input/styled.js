import styled from 'styled-components'

import { placeholderColor, error } from 'views/utils/colors'

export const ErrorMessage = styled.div`
  color: ${error};
  margin-top: 0.5em;
`

export const Input = styled.input`
  width: 100%;
  font-size: 1.125rem;
  padding: 0;
  border: none;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${placeholderColor};
  }
`
