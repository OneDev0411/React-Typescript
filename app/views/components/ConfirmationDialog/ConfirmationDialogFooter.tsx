import { ReactNode } from 'react'

import { DialogActions, ButtonProps, makeStyles } from '@material-ui/core'

import ConfirmationDialogFooterAction from './ConfirmationDialogFooterAction'
import { useCloseConfirmationDialog } from './use-close-confirmation-dialog'

const useStyles = makeStyles(
  theme => ({
    root: { padding: theme.spacing(2, 3, 3, 3) }
  }),
  { name: 'ConfirmationDialogFooter' }
)

interface ConfirmationDialogFooterProps {
  children?: ReactNode
  cancelLabel?: string
  onCancel?: ButtonProps['onClick']
  keepDialogOpenOnCancel?: boolean
  cancelProps?: Omit<ButtonProps, 'onClick' | 'children'>
  renderCancel?: (props: ButtonProps) => JSX.Element
  confirmLabel?: string
  onConfirm?: ButtonProps['onClick']
  keepDialogOpenOnConfirm?: boolean
  confirmProps?: Omit<ButtonProps, 'onClick' | 'children'>
  renderConfirm?: (props: ButtonProps) => JSX.Element
}

function ConfirmationDialogFooter({
  children,
  cancelLabel,
  onCancel,
  keepDialogOpenOnCancel,
  cancelProps,
  renderCancel,
  confirmLabel = 'OK',
  onConfirm,
  keepDialogOpenOnConfirm,
  confirmProps,
  renderConfirm
}: ConfirmationDialogFooterProps) {
  const classes = useStyles()
  const closeDialog = useCloseConfirmationDialog()

  const cancelButtonProps: ButtonProps = {
    size: 'small',
    variant: 'outlined',
    onClick: event => {
      if (!keepDialogOpenOnCancel) {
        closeDialog()
      }

      onCancel?.(event)
    },
    children: cancelLabel,
    ...cancelProps
  }

  const confirmButtonProps: ButtonProps = {
    size: 'small',
    color: 'primary',
    variant: 'contained',
    onClick: event => {
      if (!keepDialogOpenOnConfirm) {
        closeDialog()
      }

      onConfirm?.(event)
    },
    children: confirmLabel,
    ...confirmProps
  }

  return (
    <DialogActions className={classes.root}>
      {children}
      {cancelLabel && (
        <ConfirmationDialogFooterAction
          renderButton={renderCancel}
          buttonProps={cancelButtonProps}
        />
      )}
      <ConfirmationDialogFooterAction
        renderButton={renderConfirm}
        buttonProps={confirmButtonProps}
      />
    </DialogActions>
  )
}

export default ConfirmationDialogFooter
