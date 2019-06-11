import styled, { css } from 'styled-components'

import { red } from 'views/utils/colors'

interface ErrorContainerProps {
  preserveSpace?: boolean
}

export const ErrorContainer = styled.div<ErrorContainerProps>`
  color: ${red.A100};
  font-size: 0.75rem;
  ${({ preserveSpace }: ErrorContainerProps) =>
    css`
      min-height: 1.1rem;
      min-width: 1px;
    `}
`
