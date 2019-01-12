import styled, { css } from 'styled-components'
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

export const TitleContainer = styled.div`
  border: 1px solid transparent;

  ${props =>
    props.editable &&
    css`
      :hover {
        cursor: pointer;
        border: 1px dashed ${primary};
      }
    `}
`
