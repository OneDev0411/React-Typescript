import styled from 'styled-components'
import AutoTextarea from 'react-textarea-autosize'

import { grey } from '../../../utils/colors'

export const InputField = styled(AutoTextarea)`
  border: none;
  font-size: 1rem;
  width: 100%;
  border-bottom: 1px solid ${grey.A300};
  resize: none;

  ::placeholder {
    color: ${grey.A550};
    opacity: 1;
  }

  :focus {
    outline: none;
  }

  background: ${props => (props.hasError ? '#fff5f4' : 'transparent')};
`
