import styled from 'styled-components'
import { Link } from 'react-router'

import { primary } from 'views/utils/colors'

export const MLSLink = styled.a`
  margin-left: 1rem;

  :hover {
    svg {
      fill: ${primary};
    }
  }
`.withComponent(Link)
