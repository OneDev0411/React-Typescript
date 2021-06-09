import { Box, Button, ButtonProps, CircularProgress } from '@material-ui/core'

interface ShowingDetailTabSettingsSaveButtonProps
  extends Omit<
    ButtonProps,
    'color' | 'size' | 'variant' | 'children' | 'startIcon'
  > {
  alignRight?: boolean
  isSaving?: boolean
}

function ShowingDetailTabSettingsSaveButton({
  alignRight = false,
  isSaving = false,
  disabled,
  ...otherProps
}: ShowingDetailTabSettingsSaveButtonProps) {
  const button = (
    <Button
      {...otherProps}
      color="primary"
      size="small"
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
