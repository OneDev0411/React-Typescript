import styled from 'styled-components'

import { Input as BaseInput } from 'components/inline-editable-fields/styled'

export const Input = styled(BaseInput)`
  border-bottom: 1px solid #dce5eb;

  :focus {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #262626;
  }
`
