import styled, { css } from 'styled-components'

import { grey } from 'views/utils/colors'

import { theme } from '../../../../../../../theme'

interface ContainerProps {
  highlight?: boolean
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 5.625rem;
  height: 2.5rem;
  padding: 0 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 2.5;
  border-radius: 3px;
  background-color: ${grey.A100};
  transition: box-shadow 1s ease-in;

  ${({ highlight }) =>
    highlight &&
    css`
      box-shadow: 0 0 0 1px ${theme.palette.primary.main} inset;
    `}
`

export const Title = styled.span`
  margin-right: 0.5rem;
`
