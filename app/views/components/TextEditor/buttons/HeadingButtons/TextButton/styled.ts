import styled, { css } from 'styled-components'

import { primary } from 'views/utils/colors'

export const Button = styled.div<{ isActive?: boolean }>`
  padding: 0.25rem 0.875rem;
  cursor: pointer;

  &:hover {
    color: #999;
    text-decoration: underline;
  }

  ${props =>
    props.isActive &&
    css`
      color: ${primary};
    `}
`
