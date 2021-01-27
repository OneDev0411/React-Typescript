import styled, { css } from 'styled-components'
import { Theme } from '@material-ui/core'

export const PageContainer = styled.div<{
  theme: Theme
}>`
  ${({ theme }) => css`
    margin-top: ${theme.spacing(3)}px;
    padding-bottom: ${theme.spacing(2)}px;
    height: auto;
    min-height: 100vh;
  `}
`

export const TabPanel = styled.div`
  display: flex;
  justify-content: center;
`
