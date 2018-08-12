import { css } from 'styled-components'

import { blue } from '../../../utils/colors'

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

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.3;
  }
`

const isNotDisableState = '&:not([disabled]):'

export const ButtonAppearances = {
  primary: css`
    ${baseStyle};
    color: #fff;
    background-color: ${blue.A100};

    &[disabled] {
      background-color: #000;
      color: #fff;
    }

    ${isNotDisableState}hover, ${isNotDisableState}focus {
      background-color: ${blue.A200};
    }
  `,
  outline: css`
    ${baseStyle} background-color: transparent;
    border: 1px solid #000;
    color: #000;

    ${isNotDisableState}hover, ${isNotDisableState}focus {
      color: ${blue.A100};
      border-color: ${blue.A100};
    }
  `,
  link: css`
    ${baseStyle};
    color: ${blue.A100};

    &[disabled] {
      color: #000;
      text-decoration: none;
    }

    ${isNotDisableState}hover, ${isNotDisableState}focus {
      color: ${blue.A200};
      font-weight: 700;
      text-decoration: none;
    }
  `,
  icon: baseStyle
}
