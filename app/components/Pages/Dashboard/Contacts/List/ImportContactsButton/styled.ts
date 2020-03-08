import styled, { css } from 'styled-components'

import IconGoogle from 'components/SvgIcons/Google/IconGoogle'
import IconCsv from 'components/SvgIcons/Csv/IconCsv'
import IconOutlook from 'components/SvgIcons/Outlook/IconOutlook'

export const GoogleIcon = styled(IconGoogle)`
  vertical-align: middle;
` as typeof IconGoogle

export const ButtonText = styled.span`
  margin-left: 1rem;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
`

const menuItemIcon = css`
  vertical-align: middle;
  margin-right: 1rem;
`
export const CsvIcon = styled(IconCsv)`
  ${menuItemIcon}
` as typeof IconCsv

export const OutlookIcon = styled(IconOutlook)`
  ${menuItemIcon}
` as typeof IconOutlook
