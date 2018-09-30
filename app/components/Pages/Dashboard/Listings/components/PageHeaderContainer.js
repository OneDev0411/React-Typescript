import Flex from 'styled-flex-component'

import { borderColor } from '../../../../../views/utils/colors'

export const PageHeaderContainer = Flex.extend`
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5em;
  border-bottom: 1px solid ${borderColor};
`
