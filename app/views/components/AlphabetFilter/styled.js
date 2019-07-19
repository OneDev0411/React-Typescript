import styled, { css } from 'styled-components'

import ALink from 'components/ALink'
import { primary } from 'views/utils/colors'

export const LetterButtonContent = styled.span`
  display: inline-block;
  font-weight: 500;
  line-height: 2.5rem;
  margin: 0 0.4rem;
  padding: 0 0.05rem;
  border-bottom: 2px solid transparent;
`

export const LetterButton = styled(ALink)`
  cursor: pointer;
  &:hover {
    text-decoration: none;
  }
  ${({ active }) =>
    active &&
    css`
      & {
        color: ${primary};
      }
      ${LetterButtonContent} {
        border-bottom-color: currentColor;
      }
    `}
`
