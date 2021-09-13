import {
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  makeStyles
} from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles(
  { root: { minWidth: 100 } },
  { name: 'ShowingDetailTabSettingsSaveButton' }
)

export interface ShowingDetailTabSettingsSaveButtonProps
  extends Omit<
    ButtonProps,
    'color' | 'size' | 'variant' | 'children' | 'startIcon'
  > {
  alignRight?: boolean
  isSaving?: boolean
}

function ShowingDetailTabSettingsSaveButton({
  className,
  alignRight = false,
  isSaving = false,
  disabled,
  ...otherProps
}: ShowingDetailTabSettingsSaveButtonProps) {
  const classes = useStyles()

  const button = (
    <Button
      {...otherProps}
      className={classNames(classes.root, className)}
      color="primary"
      size="medium"
      variant="contained"
      startIcon={
        isSaving ? <CircularProgress size="1em" color="inherit" /> : undefined
      }
      disabled={disabled || isSaving}
    >
      {isSaving ? 'Saving' : 'Save'}
    </Button>
  )

  return alignRight ? (
    <Box display="flex" justifyContent="flex-end" mt={3}>
      {button}
    </Box>
  ) : (
    button
  )
}

export default ShowingDetailTabSettingsSaveButton
