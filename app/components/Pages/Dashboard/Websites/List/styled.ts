import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core/styles'

export const ListContainer = styled.div<ThemeProps<Theme>>`
  display: flex;
  flex-wrap: wrap;
  padding: ${props => props.theme.spacing(0, 2.75)};
`
