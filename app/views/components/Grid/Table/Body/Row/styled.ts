import { Theme } from '@material-ui/core'
import styled, { css } from 'styled-components'

export const RowContainer = styled.div<{
  index: number
  selected: boolean
  theme: Theme
}>`
  ${({ theme, index, selected }) => css`
    border-bottom: 1px solid ${theme.palette.grey[100]};
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${theme.typography.body2};
    background-color: transparent;

    .column:first-child {
      padding-left: ${theme.spacing(4)}px;
    }

    &:hover {
      background-color: ${theme.palette.grey[50]};
    }

    &:hover .primary {
      cursor: pointer;

      a {
        color: ${theme.palette.secondary.main};
        text-decoration: underline;
      }
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
