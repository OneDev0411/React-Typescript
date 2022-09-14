import { IconButton, Theme, useTheme } from '@material-ui/core'
import { mdiContentCopy } from '@mdi/js'

import useNotify from '@app/hooks/use-notify'
import copy from '@app/utils/copy-text-to-clipboard'

import { muiIconSizes, SvgIcon } from '../SvgIcons'

interface Props {
  text: string
  size?: 'medium' | 'small'
}

export function ClipboardCopy({ text, size = 'small' }: Props) {
  const theme = useTheme<Theme>()
  const notify = useNotify()

  return (
    <IconButton
      size={size}
      onClick={() => {
        copy(text)
        notify({
          status: 'success',
          message: 'Copied.'
        })
      }}
    >
      <SvgIcon
        path={mdiContentCopy}
        size={muiIconSizes[size]}
        color={theme.palette.grey[500]}
      />
    </IconButton>
  )
}
