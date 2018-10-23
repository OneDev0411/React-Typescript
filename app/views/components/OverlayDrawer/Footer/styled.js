import styled from "styled-components"
import Flex from 'styled-flex-component'

import { borderColor } from '../../../utils/colors'

export const Container = styled(Flex)`
  height: 4.5rem;
  border-top: 1px solid ${borderColor};
  margin: 0 1.5rem;
`
