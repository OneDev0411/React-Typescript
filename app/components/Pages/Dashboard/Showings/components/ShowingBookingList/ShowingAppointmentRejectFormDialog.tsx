import { makeStyles } from '@material-ui/core'

import { FormTextField } from 'components/final-form-fields'

import FormDialog, { FormDialogProps } from '../FormDialog'

const useStyles = makeStyles(
  theme => ({
    textarea: { '& textarea': { minHeight: theme.spacing(12) } }
  }),
  { name: 'ShowingAppointmentRejectFormDialog' }
)

interface FormValues {
  reason?: string
}

interface ShowingAppointmentRejectFormDialogProps
  extends Omit<
    FormDialogProps<FormValues>,
    'onConfirm' | 'title' | 'cancelLabel' | 'children'
  > {
  subject: string
  onConfirm: (reason?: string) => void
}

function ShowingAppointmentRejectFormDialog({
  classes: classesProp,
  onConfirm,
  subject,
  confirmLabel = subject,
  ...otherProps
}: ShowingAppointmentRejectFormDialogProps) {
  const classes = useStyles()

  const handleSubmit = (values: FormValues) => {
    onConfirm?.(values.reason)
  }

  return (
    <FormDialog
      title={`Are you sure you want to ${subject.toLowerCase()}?`}
      cancelLabel={`Don’t ${subject}`}
      onConfirm={handleSubmit}
      confirmLabel={confirmLabel}
      {...otherProps}
    >
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
    </FormDialog>
  )
}

export default ShowingAppointmentRejectFormDialog
