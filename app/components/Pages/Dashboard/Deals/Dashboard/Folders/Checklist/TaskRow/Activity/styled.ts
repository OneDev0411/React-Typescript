import styled, { css } from 'styled-components'
import { Theme } from '@material-ui/core'

export const LastActivity = styled.div<{
  theme: Theme
}>`
  ${({ theme }) => css`
    color: ${theme.palette.grey['900']} !important;
    color: #d1d1d1;
    opacity: 0;
    margin: ${theme.spacing(1, 0)};
    ${theme.typography.body3};

    :hover {
      color: ${theme.palette.secondary.main} !important;
      text-decoration: underline;
      cursor: pointer;
    }
  `}
`
