import { Dialog, DialogProps, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { ModernDialogCloseContext } from './context'
import ModernDialogBody from './ModernDialogBody'
import ModernDialogFooter from './ModernDialogFooter'
import ModernDialogHeader from './ModernDialogHeader'

const useStyles = makeStyles(
  {
    paper: { maxWidth: 456 }
  },
  { name: 'ModernDialog' }
)

export type ModernDialogProps = Omit<DialogProps, 'fullWidth'>

function ModernDialog({ onClose, ...otherProps }: ModernDialogProps) {
  const classes = useStyles()

  const handleClose = () => onClose?.({}, 'escapeKeyDown')

  return (
    <ModernDialogCloseContext.Provider value={handleClose}>
      <Dialog
        {...otherProps}
        fullWidth
        classes={{
          ...otherProps.classes,
          paper: classNames(classes.paper, otherProps.classes?.paper)
        }}
      />
    </ModernDialogCloseContext.Provider>
  )
}

ModernDialog.Header = ModernDialogHeader
ModernDialog.Body = ModernDialogBody
ModernDialog.Footer = ModernDialogFooter

export default ModernDialog
