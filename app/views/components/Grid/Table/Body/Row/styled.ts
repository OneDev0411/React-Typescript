import { alpha, Theme } from '@material-ui/core'
import styled, { css } from 'styled-components'

export const RowContainer = styled.div<{
  index: number
  selected: boolean
  theme: Theme
}>`
  ${({ theme, index, selected }) => `
    border-bottom: 1px solid ${theme.palette.divider};
    border-left: 1px solid ${theme.palette.divider};
    display: flex;
    align-items: stretch;
    background-color: transparent;

    &:first-child {
      border-top: 1px solid ${theme.palette.divider};
    }

    .column {
      border-right: 1px solid ${alpha(theme.palette.divider, 0.06)};
      height: 100%;
      display: flex;
      align-items: center;
      color: ${theme.palette.grey[700]};
      font-family: "${theme.typography.body2.fontFamily}";
      font-weight: ${theme.typography.body2.fontWeight};
      font-size: ${theme.typography.body2.fontSize};
      line-height: ${theme.typography.body2.lineHeight};
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

    ${
      selected &&
      css`
        background-color: ${theme.palette.action.selected};
      `
    }    

  `}
`
