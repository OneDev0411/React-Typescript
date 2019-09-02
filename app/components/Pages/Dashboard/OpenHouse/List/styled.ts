import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core/styles'

export const PageContainer = styled.div`
  padding: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 3, 9)};
  margin-top: ${(props: ThemeProps<Theme>) => props.theme.spacing(3)};
`
