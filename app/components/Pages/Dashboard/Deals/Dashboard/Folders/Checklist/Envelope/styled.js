import styled from 'styled-components'

import { primary } from 'views/utils/colors'

import { LabelItem } from '../../styled'

export const Container = styled(LabelItem)`
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
