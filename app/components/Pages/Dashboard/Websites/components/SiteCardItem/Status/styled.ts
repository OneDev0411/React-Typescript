import styled, { ThemeProps } from 'styled-components'
import { Theme } from '@material-ui/core/styles'

export const Container = styled.div<ThemeProps<Theme>>`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
