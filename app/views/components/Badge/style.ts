import { css } from 'styled-components'

import { primary, red, orange, green } from '../../utils/colors'

import ALink from '../ALink'

export const badgeBaseStyle = css`
  -webkit-appearance: none;
  -webkit-font-smoothing: antialiased;

  display: inline-block;
  white-space: nowrap;
  border-radius: 30px;

  font-family: LatoRegular;
  font-weight: 400;
`

export const badgeAppearances = {
  primary: css`
    ${badgeBaseStyle};
    color: #fff;
    background-color: ${primary};
  `,
  red: css`
    ${badgeBaseStyle};
    color: #fff;
    background-color: ${red.A200};
  `,
  warning: css`
    ${badgeBaseStyle};
    color: #fff;
    background-color: ${orange.primary};
  `,
  success: css`
    ${badgeBaseStyle};
    color: #fff;
    background-color: ${green.primary};
  `,
  black: css`
    ${badgeBaseStyle};
    color: #fff;
    background-color: #000;
    ${ALink}:hover, ${ALink}.active & {
      background-color: ${primary};
    }
  `
}
