import { Theme } from '@material-ui/core'
import styled, { ThemeProps } from 'styled-components'

import { LatoFamilyStyle } from './styles'

export const H1 = styled.h1<ThemeProps<Theme>>`
  ${LatoFamilyStyle};
  font-size: ${({ theme }) => theme.typography.h4.fontSize};
  line-height: ${({ theme }) => theme.typography.h4.lineHeight};
  font-weight: ${({ theme }) => theme.typography.h4.fontWeight};
`

export const H2 = styled.h2<ThemeProps<Theme>>`
  ${LatoFamilyStyle};
  font-size: ${({ theme }) => theme.typography.h5.fontSize};
  line-height: ${({ theme }) => theme.typography.h5.lineHeight};
  font-weight: ${({ theme }) => theme.typography.h5.fontWeight};
`

export const H3 = styled.h3<ThemeProps<Theme>>`
  ${LatoFamilyStyle};
  font-size: ${({ theme }) => theme.typography.h6.fontSize};
  line-height: ${({ theme }) => theme.typography.h6.lineHeight};
  font-weight: ${({ theme }) => theme.typography.h6.fontWeight};
`

export const H4 = styled.h4<ThemeProps<Theme>>`
  ${LatoFamilyStyle};
  font-size: ${({ theme }) => theme.typography.subtitle1.fontSize};
  line-height: ${({ theme }) => theme.typography.subtitle1.lineHeight};
  font-weight: 500;
`
