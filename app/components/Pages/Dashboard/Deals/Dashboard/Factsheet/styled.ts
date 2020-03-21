import styled, { css } from 'styled-components'

import { Theme } from '@material-ui/core'

import { H3, H4 } from 'components/Typography/headings'
import { borderColor } from 'views/utils/colors'

export const FactsheetDivider = styled.div`
  width: 3.3rem;
  height: 1px;
  margin: 1.5rem;
  background-color: ${borderColor};
`

export const Container = styled.div``

export const SectionTitle = styled(H3)`
  padding: 0 1.5rem;
  font-weight: bold;
`

export const ItemsContainer = styled.div`
  margin-top: 0.75rem;
`

export const ItemLabel = styled(H4)`
  color: #7f7f7f;
  font-weight: normal;
`

export const ItemValue = styled(H4)`
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
  ${({ theme, showBorder, isSaving }) => css`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1px 0.5rem;
    border-radius: 3px;
    padding: 0.5rem 1rem;

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
