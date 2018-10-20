import { css } from 'styled-components'

import { red } from '../../utils/colors'

export const badgeBaseStyle = css`
  -webkit-appearance: none;
  -webkit-font-smoothing: antialiased;

  display: inline-block;
  white-space: nowrap;
  border-radius: 30px;

  font-family: Barlow;
  font-size: 14px;
  font-weight: 600;
`

export const badgeAppearances = {
  red: css`
    ${badgeBaseStyle};
    color: #fff;
    background-color: ${red.A200};
  `
}
