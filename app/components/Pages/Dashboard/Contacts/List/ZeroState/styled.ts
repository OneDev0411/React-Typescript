import styled from 'styled-components'
import Flex from 'styled-flex-component'

import ActionButton from 'components/Button/ActionButton'
import LinkButton from 'components/Button/LinkButton'
import { Divider } from 'components/Divider'
import IconGoogle from 'components/SvgIcons/Google/IconGoogle'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'
import { iconWhiteBgStyle } from 'components/SvgIcons/styles'

export const ZeroStateContainer = styled(Flex)`
  height: calc(100% - 120px);
  max-width: 505px;
  margin: auto;
  text-align: center;

  ${ActionButton}, ${LinkButton}, ${Divider} {
    margin-top: 1rem;
    width: 14.6rem;
  }
  ${Divider} {
    text-align: center;
    justify-content: center;
  }
`

export const GoogleIcon = styled(IconGoogle)`
  ${iconWhiteBgStyle}
`

export const OutlookIcon = styled(IconOutlook)`
  ${iconWhiteBgStyle}
`
