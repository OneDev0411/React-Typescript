import { ComponentProps } from 'react'
import { Theme } from '@material-ui/core'
import styled, { ThemeProps } from 'styled-components'

import IconButton from '../Button/IconButton'

import { Callout } from '.'

type Props = Required<Pick<ComponentProps<typeof Callout>, 'type' | 'dense'>> &
  ThemeProps<Theme>

const bgColor = ({ theme, type }: Props) => {
  switch (type) {
    case 'error':
      return theme.palette.error.light
    case 'info':
      return theme.palette.info.light
    case 'warn':
      return theme.palette.warning.light
    case 'success':
      return theme.palette.success.light
    default:
      return theme.palette.grey['100']
  }
}
const padding = ({ theme, dense }: Props) =>
  dense ? theme.spacing(0.5, 1) : theme.spacing(1.5, 2)
const margin = ({ theme, dense }: Props) =>
  dense ? theme.spacing(2, 0) : theme.spacing(3, 2)
export const CalloutContainer = styled.div<Props>`
  border-radius: 6px;
  padding: ${padding};
  margin: ${margin};
  color: ${({ theme, type }: Props) => theme.palette.info.contrastText};
  background-color: ${bgColor};
  display: flex;
  align-items: center;
  line-height: 1.5;
`
export const CalloutContent = styled.div`
  flex: 1;
`

export const CalloutCloseButton = styled(IconButton)`
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  svg {
    margin: auto;
    fill: initial;
  }
`
