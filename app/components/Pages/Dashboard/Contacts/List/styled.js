import styled from 'styled-components'

import IconCircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

export const Container = styled.div`
  padding: 0 1.5em;
`

export const CalloutSpinner = styled(IconCircleSpinner).attrs({
  noStyles: true
})`
  margin-right: 0.5rem;
  width: 24px;
  height: 24px;
  vertical-align: middle;
`
