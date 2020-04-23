import styled, { css } from 'styled-components'
import { Theme } from '@material-ui/core'

export const Column = styled.div``

export const RowContainer = styled.div<{
  index: number
  selected: boolean
  theme: Theme
}>`
  ${({ theme, index, selected }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${index % 2 === 0
      ? theme.palette.grey[50]
      : 'transparent'};

    ${theme.typography.body1.fontSize};

    ${Column}:first-child {
      padding-left: ${theme.spacing(1)}px;
    }

    &:hover {
      background-color: ${theme.palette.action.hover};
    }

    &:hover .primary {
      cursor: pointer;
    }

    &:hover .selection--default-value {
      display: none !important;
    }

    &:hover .selection--checkbox {
      display: block !important;
    }

    ${selected &&
      css`
        background-color: ${theme.palette.action.selected};
      `}
  `}
`
