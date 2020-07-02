import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core'

export const AccountInfoWrapper = styled.div`
  line-height: 1.5;
  padding-top: ${({ theme }: ThemeProps<Theme>) => theme.spacing(1.25)}px;
  min-width: ${({ theme }: ThemeProps<Theme>) => theme.spacing(30)}px;
  .header {
    display: flex;
  }
  .secondary {
    display: flex;
    padding-left: ${({ theme }: ThemeProps<Theme>) => theme.spacing(3.5)}px;
  }
  .secondary .settings {
    position: relative;
    right: ${({ theme }: ThemeProps<Theme>) => theme.spacing(-1.25)}px;
  }
`
