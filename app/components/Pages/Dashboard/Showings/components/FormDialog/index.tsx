import { MouseEvent } from 'react'
import classNames from 'classnames'
import isEqual from 'lodash/isEqual'
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
import { Form, FormProps } from 'react-final-form'

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
    footer: { padding: theme.spacing(0, 3, 2, 3) }
  }),
  { name: 'FormDialog' }
)

export interface FormDialogProps<FormValues>
  extends Omit<DialogProps, 'fullWidth' | 'children'>,
    Pick<FormProps<FormValues>, 'initialValues' | 'mutators' | 'children'> {
  title: string
  confirmLabel?: string
  onConfirm: (values: FormValues) => void
  cancelLabel?: string
}

function FormDialog<FormValues>({
  classes: classesProp,
  onClose,
  onConfirm,
  title,
  confirmLabel = 'Submit',
  cancelLabel = 'Cancel',
  children,
  initialValues,
  mutators,
  ...otherProps
}: FormDialogProps<FormValues>) {
  const classes = useStyles()

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    onClose?.(event, 'backdropClick')
  }

  const handleSubmit = (values: FormValues) => {
    onClose?.({}, 'backdropClick')

    if (!isEqual(initialValues, values)) {
      onConfirm(values)
    }
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
      <Form<FormValues>
        onSubmit={handleSubmit}
        initialValues={initialValues}
        mutators={mutators}
      >
        {formProps => (
          <form onSubmit={formProps.handleSubmit}>
            <Box className={classes.header}>
              <DialogTitle>{title}</DialogTitle>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
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
