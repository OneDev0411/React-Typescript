import styled, { css } from 'styled-components'
import Cleave from 'cleave.js/react'

import { grey, borderColor } from '../../../utils/colors'

const inputStyle = css`
  border: none;
  font-size: 1rem;
  width: 100%;
  border-bottom: 1px solid ${borderColor};
  height: 2rem;
  padding: 0.25rem 0;

  ::placeholder {
    color: ${grey.A550};
    opacity: 1;
  }

  :focus {
    outline: none;
    border-bottom: 1px solid ${grey.A900};
  }

  background: ${props => (props.hasError ? '#fff5f4' : 'transparent')};
`

export const InputField = styled.input`
  ${inputStyle}
`

export const FormattedInputField = styled(Cleave)`
  ${inputStyle}
`
