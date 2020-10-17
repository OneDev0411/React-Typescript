import styled, { css } from 'styled-components'

import { Theme } from '@material-ui/core'

import { H3 } from 'components/Typography/headings'
import { borderColor } from 'views/utils/colors'

export const FactsheetDivider = styled.div`
  width: 3.3rem;
  height: 1px;
  margin: 1.5rem;
  background-color: ${borderColor};
`

export const Container = styled.div``

export const SectionTitle = styled(H3)`
  ${({ theme }) => css`
    padding: ${theme.spacing(0, 3)};
    ${theme.typography.subtitle1};
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
  color: #7f7f7f;
  font-weight: normal;
`

export const ItemValue = styled.span`
  font-weight: normal;
`

export const EmptyValue = styled.span`
  ${({ theme }) => css`
    color: ${theme.palette.grey['500']};
  `}
`

export const ItemActions = styled.div`
  ${({ theme }) => css`
    display: flex;
    position: absolute;
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
  ${({ theme, isSaving }) => css`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1px 0.5rem;
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

    ${isSaving &&
    `
      background-color: ${theme.palette.action.hover};
      justify-content: center;
      cursor: auto !important;
    `};
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
  position: absolute;
  height: 90%;
  border-right: 2px solid #ccc;
  left: 10.5%;
  top: 5%;
`
