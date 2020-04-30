import styled from 'styled-components'

import IconCircleCheck from 'components/SvgIcons/CircleCheckOutline/IconCircleCheckOutline'

import { primary } from 'views/utils/colors'

export const CSSLogo = styled.img`
  width: 9rem;
  height: auto;
`

export const IconCheck = styled(IconCircleCheck)`
  margin: 1rem;
  fill: ${primary};
  width: 3rem;
  height: 3rem;
` as typeof IconCircleCheck

export const LoadingContainer = styled.div`
  min-height: 21.3125rem;
  display: flex;
  padding-top: 4rem;
`
