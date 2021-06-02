import classNames from 'classnames'
import { TextField, TextFieldProps, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: {
      '& textarea': {
        minHeight: theme.spacing(13)
      }
    }
  }),
  { name: 'ShowingInstructionsTextField' }
)

type ShowingInstructionsTextFieldProps = Omit<
  TextFieldProps,
  'placeholder' | 'multiline' | 'fullWidth' | 'variant'
>

function ShowingInstructionsTextField({
  className,
  ...otherProps
}: ShowingInstructionsTextFieldProps) {
  const classes = useStyles()

  return (
    <TextField
      {...otherProps}
      className={classNames(classes.root, className)}
      placeholder="Enter information you’d like to provide"
      multiline
      fullWidth
      variant="outlined"
    />
  )
}

export default ShowingInstructionsTextField
