import styled, { ThemeProps } from 'styled-components'
import { IconButton, Theme } from '@material-ui/core'
import { IconButtonProps } from '@material-ui/core/IconButton'

export const ToolbarIconButton = styled(IconButton).attrs({
  type: 'button' as string
})`
  color: ${({ theme, color }: ThemeProps<Theme> & IconButtonProps) =>
    !color && theme.palette.grey['800']};
  padding: ${({ theme }: ThemeProps<Theme>) => `${theme.spacing(1)}px`};
  svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
`
