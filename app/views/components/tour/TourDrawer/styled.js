import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { borderColor } from '../../../utils/colors'

export const Footer = styled(Flex)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 4.5rem;
  z-index: 1;
  padding: 1.5rem;
  background-color: #fff;
  border-top: 1px solid ${borderColor};
`
