import styled from 'styled-components'

import IconGoogle from 'components/SvgIcons/Google/IconGoogle'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'
import { iconWhiteBgStyle } from 'components/SvgIcons/styles'

export const GoogleIcon = styled(IconGoogle)`
  ${iconWhiteBgStyle}
` as typeof IconGoogle

export const OutlookIcon = styled(IconOutlook)`
  ${iconWhiteBgStyle}
` as typeof IconOutlook
