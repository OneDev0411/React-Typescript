import styled from 'styled-components'

import { primary, borderColor, grey } from 'views/utils/colors'

export const Input = styled.input`
  width: 4rem;
  height: 2.5rem;
  padding: 0 0.5rem;
  margin: 0 0 0 0.5rem;
  border-radius: 3px;
  background-color: ${grey.A125};
  border: 1px solid ${borderColor};

  &:focus {
    outline: none;
    border-color: ${primary};
    background-color: #fff;
  }
`
