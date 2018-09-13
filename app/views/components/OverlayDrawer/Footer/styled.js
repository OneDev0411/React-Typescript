import Flex from 'styled-flex-component'

import { brandBackground, borderColor } from '../../../utils/colors'

export const Container = Flex.extend`
  height: 63px;
  padding: 0 1em;
  border: 1px solid ${borderColor};
  background-color: ${brandBackground};
`
