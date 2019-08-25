import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core/styles'

export const ModalContentContainer = styled.div`
  display: flex;
  padding: ${(props: ThemeProps<Theme>) => props.theme.spacing(3)}px;

  form {
    width: 100%;
  }
`

export const PageContainer = styled.div`
  padding: ${(props: ThemeProps<Theme>) => props.theme.spacing(0, 3, 9)};
  margin-top: ${(props: ThemeProps<Theme>) => `${props.theme.spacing(5)}px`};
`
