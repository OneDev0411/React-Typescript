import { MouseEvent, ReactNode } from 'react'
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
  extends Omit<DialogProps, 'fullWidth'>,
    Pick<FormProps<FormValues>, 'initialValues'> {
  title: string
  confirmLabel?: string
  onConfirm: (values: FormValues) => void
  cancelLabel?: string
  children: ReactNode
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
  ...otherProps
}: FormDialogProps<FormValues>) {
  const classes = useStyles()

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    onClose?.(event, 'backdropClick')
  }

  const handleSubmit = (values: FormValues) => {
    onClose?.({}, 'backdropClick')
    onConfirm(values)
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
      <Form<FormValues> onSubmit={handleSubmit} initialValues={initialValues}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box className={classes.header}>
              <DialogTitle>{title}</DialogTitle>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <DialogContent>{children}</DialogContent>
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
