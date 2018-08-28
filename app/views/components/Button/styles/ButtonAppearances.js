import { css } from 'styled-components'

import { blue, grey } from '../../../utils/colors'

export const buttonBaseStyle = css`
  width: ${props => (props.isBlock ? '100%' : 'auto')};

  cursor: pointer;
  -webkit-appearance: none;
  -webkit-font-smoothing: antialiased;

  border: none;
  outline: none;
  border-radius: 3px;

  position: relative;
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  vertical-align: middle;
  margin: 0;

  font-family: Barlow;
  font-weight: normal;
  text-decoration: none;
  white-space: nowrap;

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
    ${buttonBaseStyle};
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
    ${buttonBaseStyle};
    color: #000;
    border: 1px solid #000;
    background-color: ${props => (props.isActive ? grey.A100 : 'transparent')};

    ${isNotDisableState}hover, ${isNotDisableState}focus {
      color: ${blue.A100};
      border-color: ${blue.A100};
      text-decoration: none;
    }
  `,
  link: css`
    ${buttonBaseStyle};
    color: ${blue.A100};
    background-color: transparent;

    &[disabled] {
      color: #000;
      text-decoration: none;
    }

    ${isNotDisableState}hover, ${isNotDisableState}focus {
      color: ${blue.A200};
      text-decoration: none;
    }
  `,
  icon: css`
    ${buttonBaseStyle};
    background-color: transparent;
  `
}
