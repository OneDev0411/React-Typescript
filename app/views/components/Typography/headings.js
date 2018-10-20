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
  font-size: 1.25rem; /* 20px */
  font-weight: 500;
  line-height: 1.2;
`

export const H4 = styled.h4`
  ${barlowFamilyStyle};
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 600;
`
