import { css } from 'styled-components'

import { primary } from '../../utils/colors'

import ALink from '../ALink'

import { red, orange, green } from '../../utils/colors'

export const badgeBaseStyle = css`
  -webkit-appearance: none;
  -webkit-font-smoothing: antialiased;

  display: inline-block;
  white-space: nowrap;
  border-radius: 30px;

  font-family: Barlow;
  font-size: 0.75rem;
  font-weight: 600;
`

export const badgeAppearances = {
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
    ${ALink}:hover & {
      background-color: ${primary};
    }
  `
}
