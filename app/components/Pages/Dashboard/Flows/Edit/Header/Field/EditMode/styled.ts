import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core/styles'

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${(props: ThemeProps<Theme>) => props.theme.palette.error.main};
`
