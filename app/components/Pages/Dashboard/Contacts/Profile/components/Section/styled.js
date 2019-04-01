import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { borderColor } from 'views/utils/colors'
import { H3 } from 'components/Typography/headings'

export const Container = styled.div`
  padding: 1.5rem 0;

  &:not(:first-of-type) {
    padding-top: 0.5rem;
  }

  &:not(:last-of-type):after {
    margin-top: 1.5em;
    margin-left: 1.5em;
    display: block;
    content: '';
    height: 1px;
    width: 3.25rem;
    background-color: ${borderColor};
  }

  &:hover .menu__icon {
    fill: #000 !important;
  }
`

export const Header = styled(Flex)`
  padding: 0 1.5rem;
  margin-bottom: 1.5em;
`

export const Title = styled(H3)`
  margin: 0;
`
