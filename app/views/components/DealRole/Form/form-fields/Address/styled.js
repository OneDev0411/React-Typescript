import styled from 'styled-components'

import { Input as BaseInput } from 'components/inline-editable-fields/styled'
import { grey, borderColor } from 'views/utils/colors'

export const Input = styled(BaseInput)`
  border-bottom: 1px solid ${borderColor};
  padding: 0.25rem 0;

  :focus {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid ${grey.A900};
  }
`
