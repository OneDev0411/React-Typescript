import { Box, IconButton, Paper, Theme } from '@material-ui/core'
import styled, { ThemeProps } from 'styled-components'

export const LinkPreviewContainer = styled(Paper)`
  padding: ${({ theme }: ThemeProps<Theme>) => theme.spacing(0.5, 1)};
  width: 18rem;
`
export const LinkText = styled(Box)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

export const LinkPreviewIconButton = styled(IconButton)``
