import { IconButton, Theme, useTheme } from '@material-ui/core'
import { mdiContentCopy } from '@mdi/js'

import copy from '@app/utils/copy-text-to-clipboard'

import { muiIconSizes, SvgIcon } from '../SvgIcons'

interface Props {
  text: string
  size?: 'medium' | 'small'
}

export function ClipboardCopy({ text, size = 'small' }: Props) {
  const theme = useTheme<Theme>()

  return (
    <IconButton size={size} onClick={() => copy(text)}>
      <SvgIcon
        path={mdiContentCopy}
        size={muiIconSizes[size]}
        color={theme.palette.grey[500]}
      />
    </IconButton>
  )
}
