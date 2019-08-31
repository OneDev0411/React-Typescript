import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core/styles'

export const ModalContent = styled.div`
  padding: ${({ theme }: ThemeProps<Theme>) => theme.spacing(5)}px;
  text-align: center;
`

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;

  & > :nth-child(n + 2) {
    margin-left: ${({ theme }: ThemeProps<Theme>) => theme.spacing(2)}px;
  }
`
