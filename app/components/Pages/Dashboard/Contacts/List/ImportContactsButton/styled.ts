import styled, { css } from 'styled-components'

import IconGoogle from 'components/SvgIcons/Google/IconGoogle'
import IconCsv from 'components/SvgIcons/Csv/IconCsv'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'
import { iconWhiteBgStyle } from 'components/SvgIcons/styles'

export const GoogleIcon = styled(IconGoogle)`
  vertical-align: middle;
  margin: 0.25rem;
`

export const GoogleIconWithWhiteBg = styled(IconGoogle)`
  ${iconWhiteBgStyle};
  vertical-align: middle;
`

const menuItemIcon = css`
  vertical-align: middle;
  margin-right: 1rem;
`
export const CsvIcon = styled(IconCsv)`
  ${menuItemIcon}
`
export const OutlookIcon = styled(IconOutlook)`
  ${menuItemIcon}
`
