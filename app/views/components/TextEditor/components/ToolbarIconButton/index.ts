import styled, { ThemeProps } from 'styled-components'
import { IconButton, Theme } from '@material-ui/core'
import { IconButtonProps } from '@material-ui/core/IconButton'

export const ToolbarIconButton = styled(IconButton).attrs({
  type: 'button' as string
})`
  ${({ theme, color }: ThemeProps<Theme> & IconButtonProps) => {
    if (!color || color === 'default') {
      return ''
    }

    return `
        color: ${
          color === 'primary'
            ? theme.palette.primary.main
            : color === 'secondary'
            ? theme.palette.secondary.main
            : color
        } !important;
      `
  }}
  padding: ${({ theme }: ThemeProps<Theme>) => `${theme.spacing(1)}px`};
  margin: 0;
  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`
