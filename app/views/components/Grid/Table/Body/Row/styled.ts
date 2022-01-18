import { alpha, Theme } from '@material-ui/core'
import styled, { css } from 'styled-components'

export const RowContainer = styled.div<{
  index: number
  selected: boolean
  theme: Theme
}>`
  ${({ theme, index, selected }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${theme.typography.body2};

    background-color: ${index % 2 === 0
      ? theme.palette.grey[50]
      : 'transparent'};

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

    ${selected &&
    css`
      background-color: ${theme.palette.action.selected};
    `}
  `}
`

export const GridRowContainer = styled.div<{
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

    .column {
      display: flex;
      align-items: center;
      height: 100%;
      border-right: 1px solid ${alpha(theme.palette.divider, 0.06)};
    }

    ${
      selected &&
      css`
        background-color: ${theme.palette.action.selected};
      `
    }
  `}
`
