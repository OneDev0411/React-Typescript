import * as React from 'react'
import { ReactNode } from 'react'
import {
  Box,
  createStyles,
  IconButton,
  makeStyles,
  Theme
} from '@material-ui/core'

import { fade } from '@material-ui/core/styles'

import IconCircleClose from 'components/SvgIcons/CircleClose/IconCircleClose'

interface Props {
  children: ReactNode
  onDelete?: () => void
}

const useAttachmentStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        padding: `${theme.spacing(0.5, 1)}`,
        background: fade(theme.palette.primary.light, 0.1),
        borderRadius: theme.shape.borderRadius
      }
    }),
  { name: 'Attachment' }
)

export function Attachment({ children, onDelete }: Props) {
  const classes = useAttachmentStyles()

  return (
    <Box mb={1} display="flex" alignItems="center" className={classes.root}>
      <Box flexGrow={1}>{children}</Box>
      {onDelete && (
        <IconButton size="small" onClick={onDelete}>
          <IconCircleClose />
        </IconButton>
      )}
    </Box>
  )
}
