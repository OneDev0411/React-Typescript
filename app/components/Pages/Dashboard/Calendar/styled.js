import styled from 'styled-components'

import { H2 } from '../../../../views/components/Typography/headings'
import { borderColor } from '../../../../views/utils/colors'

export const MenuContainer = styled.div`
  padding: 1em;

  &:focus {
    outline: none !important;
  }
`

export const GreetingTitle = H2.extend`
  padding: 0 2rem 1rem 1rem;
  border-bottom: 1px solid ${borderColor};
`
