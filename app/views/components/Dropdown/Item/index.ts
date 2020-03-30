import styled, { css, ThemedStyledProps } from 'styled-components'
import { Theme } from '@material-ui/core'

interface Props {
  isActive?: boolean
  isSelected?: boolean
  isDisabled?: boolean
  item?: { icon?: string; iconColor?: string }
  /**
   * if set to true, hover and active state are going to be light instead of primary
   */
  noContrast?: boolean
}

export const Item = styled.div<Props>`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.5em 1em;
  cursor: pointer;
  white-space: nowrap;
  color: ${({ isActive, theme }: ThemedStyledProps<Props, Theme>) =>
    isActive ? theme.palette.primary.contrastText : theme.palette.common.black};
  background-color: ${({ isActive, theme }: ThemedStyledProps<Props, Theme>) =>
    isActive ? theme.palette.primary.main : theme.palette.common.white};
  font-weight: ${({ isSelected, isDisabled }) =>
    isSelected && !isDisabled ? 700 : 400};

  ${({ noContrast, theme }: ThemedStyledProps<Props, Theme>) =>
    noContrast
      ? css`
          &:hover,
          &:focus {
            background-color: ${theme.palette.grey[50]};
          }
        `
      : css`
          &:hover,
          &:focus {
            color: ${theme.palette.primary.contrastText};
            background-color: ${theme.palette.primary.main};

            > svg {
              fill: ${theme.palette.primary.contrastText};
            }
          }
        `}

  ${({ item }) =>
    item && item.icon && item.iconColor
      ? css`
          > svg {
            margin-right: 0.5em;
            fill: ${item.iconColor};
          }
        `
      : ''};
`
