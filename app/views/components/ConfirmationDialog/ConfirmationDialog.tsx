import { Dialog, DialogProps, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import ConfirmationDialogBody from './ConfirmationDialogBody'
import ConfirmationDialogFooter from './ConfirmationDialogFooter'
import ConfirmationDialogHeader from './ConfirmationDialogHeader'
import { ConfirmationDialogCloseContext } from './context'

const useStyles = makeStyles(
  {
    paper: { maxWidth: 456 }
  },
  { name: 'ConfirmationDialog' }
)

export type ConfirmationDialogProps = Omit<DialogProps, 'fullWidth'>

function ConfirmationDialog({
  onClose,
  ...otherProps
}: ConfirmationDialogProps) {
  const classes = useStyles()

  const handleClose = () => onClose?.({}, 'escapeKeyDown')

  return (
    <ConfirmationDialogCloseContext.Provider value={handleClose}>
      <Dialog
        {...otherProps}
        fullWidth
        classes={{
          ...otherProps.classes,
          paper: classNames(classes.paper, otherProps.classes?.paper)
        }}
      />
    </ConfirmationDialogCloseContext.Provider>
  )
}

ConfirmationDialog.Header = ConfirmationDialogHeader
ConfirmationDialog.Body = ConfirmationDialogBody
ConfirmationDialog.Footer = ConfirmationDialogFooter

export default ConfirmationDialog
