import { css } from 'styled-components'

const baseStyle = css`
  -webkit-appearance: none;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  vertical-align: middle;
  text-decoration: none;
  border: none;
  outline: none;
  cursor: pointer;

  &::-moz-focus-inner {
    border: 0;
  }

  &[disabled],
  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.3;
  }
`

const disableState = '&:not([disabled]):not([data-disabled]):'

export const ButtonAppearances = {
  default: css`
    ${baseStyle} color: #fff;
    background-color: #003bdf;

    &[disabled],
    &[data-disabled] {
      background-color: #000;
      color: #fff;
    }

    ${disableState}hover, ${disableState}focus {
      background-color: #022ca0;
    }
  `,
  outline: css`
    ${baseStyle}

    background-color: transparent;
    border: 1px solid #000;
    color: #000;

    ${disableState}hover,
    ${disableState}focus {
      color: #003bdf
      border-color: #003bdf
    }
  `
}
