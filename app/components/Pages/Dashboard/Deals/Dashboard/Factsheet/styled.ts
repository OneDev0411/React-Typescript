import styled, { css } from 'styled-components'

import { Theme, Typography } from '@material-ui/core'

export const SectionTitle = styled(Typography)`
  ${({ theme }) => `
    padding: ${theme.spacing(0, 3)};
    color: ${theme.palette.grey['700']};
  `}
`

export const ItemsContainer = styled.div`
  margin-top: 0.75rem;
  position: relative;

  ${({ theme }) => css`
    ${theme.typography.body2};
  `}
`

export const ItemLabel = styled.span`
  display: flex;
  align-items: center;
  font-weight: normal;
  margin-right: ${({ theme }) => theme.spacing(1)}px;
`

export const ItemValue = styled.span`
  ${({ theme }) => css`
    font-weight: normal;
    color: ${theme.palette.grey['500']};
  `}
`

export const ItemActions = styled.div`
  ${({ theme }) => css`
    display: flex;
    position: absolute;
    align-items: center;
    right: 0;
    visibility: hidden;
    padding-right: ${theme.spacing(1)}px;
  `}
`

export const Editable = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  input {
    width: 100%;
    border: none;

    :focus {
      outline: none;
    }
  }
`

export const Item = styled.div<{
  theme: Theme
  showBorder?: boolean
  isSaving?: boolean
}>`
  ${({ theme, isSaving }) => `
    position: relative;
    display: flex;
    align-items: center;
    margin: 0 0.5rem;
    border-radius: 3px;
    padding: ${theme.spacing(1, 2)};

    :hover {
      background-color: ${theme.palette.action.hover};
      cursor: pointer;
    }

    :hover ${ItemValue} {
      display: none;
    }

    :hover ${ItemActions} {
      visibility: visible;
    }

    ${
      isSaving &&
      `
      background-color: ${theme.palette.action.hover};
      justify-content: center;
      cursor: auto !important;
    `
    };
  `}
`

export const CircleStatus = styled.span<{
  checked: boolean
}>`
  ${({ theme, checked }) => css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 100%;
    margin-right: 0.5rem;
    background: #fff;
    border: 1px solid ${theme.palette.divider};

    ${checked &&
    `
      background: ${theme.palette.primary.main};
      border-color: ${theme.palette.primary.main};
    `}
  `}
`

export const TimelineSplitter = styled.div`
  ${({ theme }) => css`
    position: absolute;
    height: calc(100% - ${theme.spacing(3)}px);
    border-right: 2px solid #ccc;
    left: ${theme.spacing(4)}px;
    top: ${theme.spacing(1.5)}px;
  `}
`
