import { Theme } from '@material-ui/core'
import styled, { ThemeProps } from 'styled-components'

import { LatoFamilyStyle } from './styles'

export const H1 = styled.h1`
  ${LatoFamilyStyle};
  font-size: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.h4.fontSize};
  line-height: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.h4.lineHeight};
  font-weight: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.h4.fontWeight};
`

export const H2 = styled.h2`
  ${LatoFamilyStyle};
  font-size: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.h5.fontSize};
  line-height: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.h5.lineHeight};
  font-weight: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.h5.fontWeight};
`

export const H3 = styled.h3`
  ${LatoFamilyStyle};
  font-size: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.h6.fontSize};
  line-height: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.h6.lineHeight};
  font-weight: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.h6.fontWeight};
`

export const H4 = styled.h4`
  ${LatoFamilyStyle};
  font-size: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.subtitle1.fontSize};
  line-height: ${(props: ThemeProps<Theme>) =>
    props.theme.typography.subtitle1.lineHeight};
  font-weight: 500;
`
