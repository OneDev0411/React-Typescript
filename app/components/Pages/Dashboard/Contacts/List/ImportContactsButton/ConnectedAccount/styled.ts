import styled from 'styled-components'

import { grey, primary } from 'views/utils/colors'
import ALink from 'components/ALink'

export const AccountInfoWrapper = styled.div`
  line-height: 1.5;
  .header {
    font-weight: 600;
  }
  .secondary {
    color: ${grey.A900};
  }
  .dot {
    margin: 0 0.8rem;
  }
  ${ALink} {
    color: ${primary};
  }
`
