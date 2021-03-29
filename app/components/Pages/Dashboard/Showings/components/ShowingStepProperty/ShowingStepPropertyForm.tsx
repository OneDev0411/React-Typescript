import React from 'react'
import { Box, Button, makeStyles } from '@material-ui/core'

import ShowingPropertyForm, {
  ShowingPropertyFormProps
} from '../ShowingPropertyForm'

const useStyles = makeStyles(
  theme => ({
    form: {
      border: `1px solid ${theme.palette.grey[200]}`,
      borderRadius: theme.shape.borderRadius
    },
    footer: {
      borderTop: `1px solid ${theme.palette.grey[200]}`,
      height: theme.spacing(9),
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    button: { marginLeft: theme.spacing(1) }
  }),
  { name: 'ShowingStepPropertyForm' }
)

export interface ShowingStepPropertyFormProps
  extends Omit<ShowingPropertyFormProps, 'onSubmit'> {
  onBack: () => void
  onConfirm: ShowingPropertyFormProps['onSubmit']
  onCancel?: () => void
}

function ShowingStepPropertyForm({
  onBack,
  onConfirm,
  onCancel,
  ...otherProps
}: ShowingStepPropertyFormProps) {
  const classes = useStyles()

  return (
    <Box pt={3} pl={3} pr={3} className={classes.form}>
      <ShowingPropertyForm {...otherProps} onSubmit={onConfirm}>
        <Box className={classes.footer}>
          <div>
            <Button variant="text" onClick={onBack}>
              Back
            </Button>
            {onCancel && (
              <Button
                type="button"
                size="small"
                variant="text"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className={classes.button}
              size="small"
              variant="contained"
              color="primary"
            >
              Add and Continue
            </Button>
          </div>
        </Box>
      </ShowingPropertyForm>
    </Box>
  )
}

export default ShowingStepPropertyForm
