import styled from 'styled-components'
import { grey } from '../../../utils/colors'

export const InputField = styled.input`
  border: none;
  font-size: 16px;
  width: 100%;
  border-radius: 4px;

  ::placeholder {
    color: ${grey.A550};
    opacity: 1;
  }

  :focus {
    outline: none;
  }

  background: ${props => (props.hasError ? '#fff5f4' : 'transparent')};
`
