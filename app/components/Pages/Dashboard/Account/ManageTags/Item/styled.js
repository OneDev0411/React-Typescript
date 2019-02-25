import styled from 'styled-components'

import IconCircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

export const LoadingIcon = styled(IconCircleSpinner).attrs(() => ({
  noStyles: true
}))`
  position: absolute;
  height: 2.5rem;
  right: 0.15625rem;
  top: 0;
`
