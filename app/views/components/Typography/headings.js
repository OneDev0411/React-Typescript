import styled from 'styled-components'

import { barlowFamilyStyle, merriweatherFamilyStyle } from './styles'

export const H1 = styled.h1`
  ${merriweatherFamilyStyle};
  font-size: 32px;
  font-weight: bold;
  line-height: 1;
`

export const H2 = styled.h2`
  ${barlowFamilyStyle};
  font-size: 32px;
  font-weight: bold;
  line-height: 1;
`

export const H3 = styled.h3`
  ${barlowFamilyStyle};
  font-size: 21px;
  font-weight: 500;
  line-height: 0.76;
`

export const H4 = styled.h4`
  ${barlowFamilyStyle};
  font-size: 16px;
  font-weight: 600;
`
