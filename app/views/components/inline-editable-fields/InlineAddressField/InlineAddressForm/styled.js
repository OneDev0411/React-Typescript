import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { primary, grey, borderColor } from '../../../../utils/colors'
import Card from '../../../Card'

export const Container = styled(Card)`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 100%;
  z-index: 1;
`

export const Body = styled.div`
  padding: 1rem;
  background-color: #fff;
`

export const Footer = styled(Flex)`
  padding: 0.5rem 1rem;
  background-color: ${grey.A100};
`
