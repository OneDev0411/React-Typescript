import { Theme } from '@material-ui/core/styles'
import styled, { ThemeProps } from 'styled-components'

export const ContentContainer = styled.div`
  display: flex;
  padding: ${(props: ThemeProps<Theme>) => props.theme.spacing(3)}px;

  form {
    width: 100%;
  }
`
