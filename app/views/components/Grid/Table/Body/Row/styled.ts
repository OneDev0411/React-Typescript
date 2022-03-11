import { Theme } from '@material-ui/core'
import styled, { css } from 'styled-components'

export const RowContainer = styled.div<{
  index: number
  selected: boolean
  theme: Theme
}>`
  ${({ theme, index, selected }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px !important;
    ${theme.typography.body2};

    background-color: ${
      index % 2 === 0 ? theme.palette.grey[50] : 'transparent'
    };

    .column:first-child {
      padding-left: ${theme.spacing(1)}px;
    }

    &:hover {
      background-color: ${theme.palette.action.hover};
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

    ${
      selected &&
      css`
        background-color: ${theme.palette.action.selected};
      `
    }
  `}
`
