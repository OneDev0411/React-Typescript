import styled from 'styled-components'

import { primary } from 'views/utils/colors'

import IconCircleCheck from 'components/SvgIcons/CircleCheck/IconCircleCheck'

export const CSSLogo = styled.img`
  width: 9rem;
  height: auto;
`

export const IconCheck = styled(IconCircleCheck)`
  margin: 1rem;
  fill: ${primary};
  width: 3rem;
  height: 3rem;
`

export const LoadingContainer = styled.div`
  min-height: 21.3125rem;
  display: flex;
  padding-top: 4rem;
`
