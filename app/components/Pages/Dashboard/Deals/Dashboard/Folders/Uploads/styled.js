import styled from 'styled-components'

import ActionButton from 'components/Button/ActionButton'
import { primary } from 'views/utils/colors'

export const EmailButton = styled(ActionButton)`
  :hover {
    svg g path {
      fill: ${primary};
    }
  }
`
