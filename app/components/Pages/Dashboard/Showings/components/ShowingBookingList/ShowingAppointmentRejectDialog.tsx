import { MouseEvent } from 'react'
import classNames from 'classnames'
import {
  Dialog,
  DialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
  Box,
  IconButton
} from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'
import { Form } from 'react-final-form'

import { FormTextField } from 'components/final-form-fields'

const useStyles = makeStyles(
  theme => ({
    paper: { maxWidth: 600 },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: theme.spacing(8),
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
      paddingRight: theme.spacing(1)
    },
    textarea: { '& textarea': { minHeight: theme.spacing(12) } },
    footer: { padding: theme.spacing(0, 3, 2, 3) }
  }),
  { name: 'ShowingAppointmentRejectDialog' }
)

interface FormValues {
  reason?: string
}

interface ShowingAppointmentRejectDialogProps
  extends Omit<DialogProps, 'fullWidth'> {
  subject: string
  onConfirm?: (reason?: string) => void
  confirmLabel?: string
}

function ShowingAppointmentRejectDialog({
  classes: classesProp,
  onClose,
  onConfirm,
  subject,
  confirmLabel = subject,
  ...otherProps
}: ShowingAppointmentRejectDialogProps) {
  const classes = useStyles()

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    onClose?.(event, 'backdropClick')
  }

  const handleSubmit = (values: FormValues) => {
    onClose?.({}, 'backdropClick')
    onConfirm?.(values.reason)
  }

  return (
    <Dialog
      {...otherProps}
      onClose={onClose}
      fullWidth
      classes={{
        ...classesProp,
        paper: classNames(classes.paper, classesProp?.paper)
      }}
    >
      <Form<FormValues> onSubmit={handleSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box className={classes.header}>
              <DialogTitle>
                Are you sure you want to {subject.toLowerCase()}?
              </DialogTitle>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <DialogContent>
              <FormTextField
                name="reason"
                className={classes.textarea}
                autoFocus
                margin="normal"
                label="Leave a message"
                fullWidth
                multiline
                variant="outlined"
              />
            </DialogContent>
            <DialogActions className={classes.footer}>
              <Button
                type="button"
                size="small"
                variant="outlined"
                onClick={handleClose}
              >
                Don’t {subject}
              </Button>
              <Button
                type="submit"
                size="small"
                color="secondary"
                variant="contained"
              >
                {confirmLabel}
              </Button>
            </DialogActions>
          </form>
        )}
      </Form>
    </Dialog>
  )
}

export default ShowingAppointmentRejectDialog
