import styled from 'styled-components'
import Flex from 'styled-flex-component'

import ActionButton from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'
import { Divider } from 'components/Divider'
import IconGoogle from 'components/SvgIcons/Google/IconGoogle'

export const ZeroStateContainer = styled(Flex)`
  height: calc(100% - 120px);
  max-width: 505px;
  margin: auto;
  text-align: center;

  ${ActionButton}, ${LinkButton}, ${Divider} {
    text-align: center;
    justify-content: center;
    margin-top: 1rem;
    width: 14.6rem;
  }
`
export const GoogleIcon = styled(IconGoogle)`
  margin-right: 0.4rem;
  background: #fff;
  border-radius: 50%;
  padding: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
`
