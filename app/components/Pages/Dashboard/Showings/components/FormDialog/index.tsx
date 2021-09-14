import { MouseEvent } from 'react'

import {
  DialogContent,
  DialogActions,
  Button,
  makeStyles
} from '@material-ui/core'
import { FormApi } from 'final-form'
import isEqual from 'lodash/isEqual'
import { Form, FormProps } from 'react-final-form'

import Dialog, { DialogProps } from '../Dialog'

const useStyles = makeStyles(
  theme => ({
    footer: { padding: theme.spacing(0, 3, 2, 3) }
  }),
  { name: 'FormDialog' }
)

export interface FormDialogProps<FormValues>
  extends Omit<DialogProps, 'fullWidth' | 'children'>,
    Pick<FormProps<FormValues>, 'initialValues' | 'mutators' | 'children'> {
  title: string
  confirmLabel?: string
  onConfirm: FormProps<FormValues>['onSubmit']
  cancelLabel?: string
  noValidate?: boolean
}

function FormDialog<FormValues>({
  classes: classesProp,
  onClose,
  onConfirm,
  confirmLabel = 'Submit',
  cancelLabel = 'Cancel',
  children,
  initialValues,
  mutators,
  noValidate,
  ...otherProps
}: FormDialogProps<FormValues>) {
  const classes = useStyles()

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    onClose?.(event, 'backdropClick')
  }

  const handleSubmit = (values: FormValues, form: FormApi<FormValues>) => {
    onClose?.({}, 'backdropClick')

    if (!isEqual(initialValues, values)) {
      onConfirm(values, form)
    }
  }

  return (
    <Dialog {...otherProps} onClose={onClose} hasDialogContent={false}>
      <Form<FormValues>
        onSubmit={handleSubmit}
        initialValues={initialValues}
        mutators={mutators}
      >
        {formProps => (
          <form onSubmit={formProps.handleSubmit} noValidate={noValidate}>
            <span />
            <DialogContent>
              {typeof children === 'function' ? children(formProps) : children}
            </DialogContent>
            <DialogActions className={classes.footer}>
              <Button
                type="button"
                size="small"
                variant="outlined"
                onClick={handleClose}
              >
                {cancelLabel}
              </Button>
              <Button
                type="submit"
                size="small"
                color="primary"
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

export default FormDialog
