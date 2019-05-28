import styled, { css } from 'styled-components'

import { grey, primary } from '../../../utils/colors'

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
  color: ${props => (props.isActive ? '#fff' : '#000')};
  background-color: ${props => (props.isActive ? primary : '#fff')};
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
            color: #fff;
            background-color: ${primary};

            > svg {
              fill: #fff;
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
