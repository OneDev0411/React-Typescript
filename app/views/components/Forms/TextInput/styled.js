import styled from 'styled-components'

import { grey } from '../../../utils/colors'

export const InputField = styled.input`
  border: none;
  font-size: 16px;
  width: 100%;
  border-bottom: 1px solid #dce5eb;
  height: 1.7rem;

  ::placeholder {
    color: ${grey.A550};
    opacity: 1;
  }

  :focus {
    outline: none;
    border-bottom: 1px solid #ccc;
  }

  background: ${props => (props.hasError ? '#fff5f4' : 'transparent')};
`
