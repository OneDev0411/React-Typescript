import styled, { css, ThemedStyledProps } from 'styled-components'
import { Theme } from '@material-ui/core'

interface Props {
  isActive?: boolean
  isSelected?: boolean
  isDisabled?: boolean
  item?: { icon?: string; iconColor?: string }
}

export const Item = styled.div<Props>`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.5em 1em;
  cursor: pointer;
  white-space: nowrap;
  background-color: ${({
    isSelected,
    theme
  }: ThemedStyledProps<Props, Theme>) =>
    isSelected ? theme.palette.action.selected : 'transparent'};

  &:hover {
    background-color: ${({
      isActive,
      isSelected,
      theme
    }: ThemedStyledProps<Props, Theme>) =>
      isActive
        ? isSelected
          ? theme.palette.action.selected
          : theme.palette.action.hover
        : 'inherit'};
  }

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
