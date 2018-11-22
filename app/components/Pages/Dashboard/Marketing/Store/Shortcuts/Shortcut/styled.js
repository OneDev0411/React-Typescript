import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { grey } from 'views/utils/colors'

export const Placeholder = styled(Flex)`
  width: 10.25rem;
  height: 8.25rem;
  margin-bottom: 0.5rem;
  border-radius: 3px;
  background-color: ${grey.A100};

  > img {
    width: 50%;
  }
`
