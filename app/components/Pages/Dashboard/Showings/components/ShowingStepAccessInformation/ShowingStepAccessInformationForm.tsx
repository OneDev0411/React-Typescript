import React from 'react'
import { Box, Button, makeStyles } from '@material-ui/core'
import { Form } from 'react-final-form'

import { FormTextField } from 'components/final-form-fields'

const useStyles = makeStyles(
  theme => ({
    root: {
      '& textarea': {
        minHeight: theme.spacing(13)
      }
    }
  }),
  { name: 'ShowingStepAccessInformationForm' }
)

interface FormValues {
  info: string
}

interface ShowingStepAccessInformationFormProps {
  value: string
  onSubmit: (value: string) => void
}

function ShowingStepAccessInformationForm({
  value,
  onSubmit
}: ShowingStepAccessInformationFormProps) {
  const classes = useStyles()

  const handleSubmit = (data: FormValues) => {
    onSubmit(data.info)
  }

  return (
    <Box mx={1.5} mb={1}>
      <Form<FormValues> onSubmit={handleSubmit} initialValue={{ info: value }}>
        {({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <FormTextField
              name="info"
              className={classes.root}
              placeholder="enter information you’d like to provide"
              multiline
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                type="submit"
                size="small"
                variant="contained"
                color="primary"
                disabled={!values.info}
              >
                Continue
              </Button>
            </Box>
          </form>
        )}
      </Form>
    </Box>
  )
}

export default ShowingStepAccessInformationForm
