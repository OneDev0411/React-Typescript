import { css } from 'styled-components'

export const isOutline = props =>
  props.appearance === 'outline' || props.inverse

export const getStatesStyle = props => {
  if (props.disabled) {
    return
  }

  if (isOutline(props)) {
    return css`
      &:hover,
      &:hover {
        > svg {
          fill: #003bdf;
        }
      }
    `
  }
}

export const getIconSize = size => {
  switch (size) {
    case 'small':
      return '12px'

    case 'large':
      return '24px'

    default:
      return '16px'
  }
}

export const iconAim = {
  none: null,
  top: '0deg',
  up: '0deg',
  right: '90deg',
  bottom: '180deg',
  down: '180deg',
  left: '270deg'
}
