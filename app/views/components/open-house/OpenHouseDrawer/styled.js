import styled from "styled-components"
import Flex from 'styled-flex-component'

import { borderColor } from '../../../utils/colors'

export const Footer = styled(Flex)`
  position: absolute;
  bottom: 0;
  left: 1.5rem;
  right: 0;
  width: calc(100% - 3rem);
  height: 4.5rem;
  background-color: #fff;
  border-top: 1px solid ${borderColor};
`
