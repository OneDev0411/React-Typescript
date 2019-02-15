import styled from 'styled-components'

import { primary } from 'views/utils/colors'

import { LabelItem } from '../../styled'

export const Container = styled(LabelItem)`
  a {
    text-decoration: none;
    color: #000;
  }

  ${props =>
    !props.disabled &&
    `
    :hover {
      cursor: pointer;
      color: ${primary};
      text-decoration: underline;
    }
  `}
`
