import { css } from 'styled-components'

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
          fill: #003bdf;
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
