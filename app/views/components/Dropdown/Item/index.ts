import styled, { css } from 'styled-components'

import { grey } from 'views/utils/colors'

import { theme } from '../../../../theme'

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
  color: ${props =>
    props.isActive
      ? theme.palette.primary.contrastText
      : theme.palette.common.black};
  background-color: ${props =>
    props.isActive ? theme.palette.primary.main : theme.palette.common.white};
  font-weight: ${props => (props.isSelected && !props.isDisabled ? 700 : 400)};

  ${({ noContrast }) =>
    noContrast
      ? css`
          &:hover,
          &:focus {
            background-color: ${grey.A150};
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

  ${props =>
    props.item && props.item.icon && props.item.iconColor
      ? css`
          > svg {
            margin-right: 0.5em;
            fill: ${props.item.iconColor};
          }
        `
      : ''};
`
