import styled, { css } from 'styled-components'

import { Theme } from '@material-ui/core'

import { Container as ActionsButton } from '../../components/ActionsButton/styled'

import { LastActivity } from './Checklist/TaskRow/Activity/styled'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 11rem;
`

/* folder */
export const FolderContainer = styled.div`
  border-radius: 3px;
  background-color: #fff;
  border: solid 1px #d4d4d4;
  margin-bottom: 1rem;
`

export const Header = styled.div`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 3.5rem;
    padding: 0 calc(1rem + 3px);
    border-bottom: 1px solid ${theme.palette.divider};
    background: ${theme.palette.grey['300']};
  `}
`

export const HeaderTitle = styled.div`
  ${({ theme }) => css`
    margin-right: ${theme.spacing(1)}px;
    ${theme.typography.subtitle1};
  `}
`

export const ItemsContainer = styled.div<{
  isOpen: boolean
}>`
  transition: all ease-in 1s;
  height: auto;

  ${props =>
    props.isOpen === false &&
    css`
      height: 0;
      overflow: hidden;
    `};
`

/* item rows */
export const RowContainer = styled.div<{
  theme: Theme
  isTaskExpanded: boolean
}>`
  border-left: 3px solid transparent;

  ${({ theme }) => `
    :nth-child(odd) {
      background-color: ${theme.palette.grey['50']};
    }

    :hover {
      background-color: ${theme.palette.action.hover};
    }
  `}

  ${props =>
    props.isTaskExpanded &&
    `
      :nth-child(even) {
        border-left: 3px solid #000;
      }

      :nth-child(odd) {
        border-left: 3px solid ${({ theme }) => theme.palette.secondary.main};
      }

      ${ActionsButton} {
        opacity: 1;
        border: 1px solid #d4d4d4;
      }

      ${LastActivity} {
        opacity: 1;
        color: #000;
      }
    `}

  :hover ${ActionsButton} {
    opacity: 1;
    border: 1px solid #d4d4d4;
  }

  :hover ${LastActivity} {
    opacity: 1;
    color: #000;
  }

  :hover .deal--task-comments path {
    fill: #000 !important;
  }
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
`

export const RowTitle = styled.div<{
  clickable: boolean
  theme: Theme
}>`
  ${({ theme, clickable }) => css`
    margin-bottom: 0.75rem;
    ${theme.typography.body2};
    font-weight: bold;

    ${clickable &&
    `
        :hover {
          cursor: pointer;
          color: #0945eb;
        }
      `}
  `}
`

export const LabelItem = styled.div`
  display: inline-flex;
  align-items: center;
  color: #4d4d4d;
  border-radius: 12px;
  background-color: #e6e6e6;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 0.75rem;
  margin-right: 0.5rem;
  max-height: 1.5rem;
  white-space: nowrap;
`
