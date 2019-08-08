import styled, { css } from 'styled-components'

import BaseIconButton from 'components/Button/IconButton'
import { primary } from 'views/utils/colors'

export const IconButton = styled(BaseIconButton).attrs({ type: 'button' })`
  padding: 0;
  margin: 0 0.5rem 0 0;
  width: 1.5rem;
  height: 1.5rem;

  svg * {
    fill: #262626;
  }

  &:hover svg * {
    fill: #999;
  }

  ${props =>
    props.isActive &&
    css`
      svg * {
        fill: ${primary};
      }
    `}
`
