import {
  Button,
  ButtonProps,
  makeStyles,
  TextField,
  TextFieldProps
} from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex'
    },
    button: {
      minWidth: theme.spacing(12),
      marginLeft: theme.spacing(2)
    },
    textField: {
      flexShrink: 1,
      flexGrow: 1
    },
    buttonHolder: {
      flexShrink: 0,
      flexGrow: 0
    }
  }),
  { name: 'SocialDrawerAction' }
)

interface SocialDrawerActionProps {
  className?: string
  textFieldProps: Omit<
    TextFieldProps,
    'variant' | 'size' | 'InputLabelProps' | 'className'
  >
  buttonProps: Omit<ButtonProps, 'size' | 'variant' | 'color' | 'className'>
}

function SocialDrawerAction({
  className,
  textFieldProps,
  buttonProps
}: SocialDrawerActionProps) {
  const classes = useStyles()

  return (
    <div className={classNames(classes.root, className)}>
      <TextField
        {...textFieldProps}
        className={classes.textField}
        variant="outlined"
        size="small"
        InputLabelProps={{ shrink: true }}
      />
      <div className={classes.buttonHolder}>
        <Button
          {...buttonProps}
          className={classes.button}
          variant="outlined"
          color="primary"
        />
      </div>
    </div>
  )
}

export default SocialDrawerAction
