import styled from 'styled-components'

import { barlowFamilyStyle, merriweatherFamilyStyle } from './styles'

export const H1 = styled.h1`
  ${merriweatherFamilyStyle};
  font-size: 2rem;
  line-height: 1;
  font-weight: bold;
`

export const H2 = styled.h2`
  ${barlowFamilyStyle};
  font-size: 2rem;
  line-height: 1;
  font-weight: bold;
`

export const H3 = styled.h3`
  ${barlowFamilyStyle};
  font-size: 1.3125rem; /* 21px */
  font-weight: 500;
  line-height: 1.1428571428571428; /* 24px */
`

export const H4 = styled.h4`
  ${barlowFamilyStyle};
  font-size: 1rem;
  font-weight: 600;
`
