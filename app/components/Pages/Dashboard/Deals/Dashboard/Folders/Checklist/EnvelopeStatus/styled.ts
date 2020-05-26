import styled from 'styled-components'

import { LabelItem } from '../../styled'

export const Container = styled(LabelItem)<{
  disabled?: boolean
}>`
  a {
    text-decoration: none;
    color: #000;
  }

  ${props =>
    !props.disabled &&
    `
    :hover {
      cursor: pointer;
      color: ${({ theme }) => theme.palette.secondary.main};
      text-decoration: underline;
    }
  `}
`
