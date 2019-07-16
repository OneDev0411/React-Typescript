import styled from 'styled-components'
import Flex from 'styled-flex-component'

import IconCircleSpinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

export const Container = styled.div`
  padding: 0 1.5em;
`

export const SearchWrapper = styled(Flex)`
  @media screen and (max-width: 1200px) {
    flex-wrap: wrap;
    > div {
      overflow: auto;
    }
  }
`
export const CalloutSpinner = styled(IconCircleSpinner).attrs({
  noStyles: true
})`
  margin-right: 0.5rem;
  width: 24px;
  height: 24px;
  vertical-align: middle;
`
