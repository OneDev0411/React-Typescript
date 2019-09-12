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

import classNames from 'classnames'

import IconCircleClose from 'components/SvgIcons/CircleClose/IconCircleClose'
import IconAttachment from 'components/SvgIcons/Attachment/IconAttachment'

import { useIconStyles } from '../../../../../styles/use-icon-styles'
import { useTextStyles } from '../../../../../styles/use-text-styles'

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
  const iconClasses = useIconStyles()
  const textClasses = useTextStyles()

  return (
    <Box mb={1} display="flex" alignItems="center" className={classes.root}>
      <IconAttachment
        className={classNames(iconClasses.rightMargin, iconClasses.small)}
      />
      <Box flexGrow={1} className={textClasses.noWrap}>
        {children}
      </Box>
      {onDelete && (
        <IconButton size="small" onClick={onDelete}>
          <IconCircleClose />
        </IconButton>
      )}
    </Box>
  )
}
