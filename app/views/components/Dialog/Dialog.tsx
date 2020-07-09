import React, { ReactNode } from 'react'
import {
  Button,
  DialogContent,
  DialogActions,
  makeStyles,
  Theme,
  DialogProps,
  Dialog as MUIDialog
} from '@material-ui/core'

import DialogTitle from './DialogTitle'

const useStyles = makeStyles(
  (theme: Theme) => ({
    content: {
      padding: theme.spacing(2)
    },
    footer: {
      padding: theme.spacing(2)
    },
    actionButton: {
      marginLeft: theme.spacing(1)
    }
  }),
  {
    name: 'Dialog'
  }
)

interface Props extends DialogProps {
  cancelButtonText?: string
  children: ReactNode
  id: string
  open: boolean
  onClose: () => void
  onSave?: () => void
  saveButtonText?: string
}

function Dialog({
  cancelButtonText,
  children,
  id,
  open,
  onClose,
  onSave,
  saveButtonText,
  title,
  ...props
}: Props) {
  const classes = useStyles()

  return (
    <MUIDialog onClose={onClose} aria-labelledby={id} open={open} {...props}>
      <DialogTitle id={id} onClose={onClose}>
        {title}
      </DialogTitle>
      <DialogContent className={classes.content} dividers>
        {children}
      </DialogContent>
      <DialogActions className={classes.footer}>
        <Button onClick={onClose}>{cancelButtonText || 'Cancel'}</Button>
        {onSave && (
          <Button
            onClick={onSave}
            color="secondary"
            className={classes.actionButton}
          >
            {saveButtonText || 'Save'}
          </Button>
        )}
      </DialogActions>
    </MUIDialog>
  )
}

export default Dialog
