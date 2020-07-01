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
import { mdiAttachment, mdiCloseCircleOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useTextStyles } from '../../../../../styles/use-text-styles'

interface Props {
  children: ReactNode
  /**
   * Defaults to true
   */
  fullWidth?: boolean
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

export function Attachment({ children, onDelete, fullWidth = true }: Props) {
  const classes = useAttachmentStyles()
  const textClasses = useTextStyles()

  return (
    <Box
      mb={1}
      mr={1}
      display={fullWidth ? 'flex' : 'inline-flex'}
      alignItems="center"
      className={classes.root}
    >
      <SvgIcon path={mdiAttachment} rightMargined />
      <Box flexGrow={1} className={textClasses.noWrap}>
        {children}
      </Box>
      {onDelete && (
        <IconButton size="small" onClick={onDelete}>
          <SvgIcon path={mdiCloseCircleOutline} />
        </IconButton>
      )}
    </Box>
  )
}
