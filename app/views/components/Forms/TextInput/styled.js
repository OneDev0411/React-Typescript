import styled from 'styled-components'

import { grey } from '../../../utils/colors'

export const InputField = styled.input`
  border: none;
  font-size: 1rem;
  width: 100%;
  border-bottom: 1px solid #dce5eb;
  height: 2rem;
  padding: 0.25rem 0;

  ::placeholder {
    color: ${grey.A550};
    opacity: 1;
  }

  :focus {
    outline: none;
    border-bottom: 1px solid #262626;
  }

  background: ${props => (props.hasError ? '#fff5f4' : 'transparent')};
`
