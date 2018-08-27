import { css } from 'styled-components'
import { blue } from '../../../utils/colors'

export const iconAims = {
  none: null,
  top: '0deg',
  up: '0deg',
  right: '90deg',
  bottom: '180deg',
  down: '180deg',
  left: '270deg'
}

export function isOutline(props) {
  return props.appearance === 'outline' || props.inverse
}

export function getIconStatesStyle(props) {
  if (props.disabled) {
    return
  }

  if (isOutline(props) || props.appearance === 'icon') {
    return css`
      &:hover,
      &:hover {
        > svg {
          fill: ${blue.A100};
        }
      }
    `
  }
}

export function getIconSize(size) {
  switch (size) {
    case 'small':
      return '12px'

    case 'large':
      return '24px'

    default:
      return '16px'
  }
}
