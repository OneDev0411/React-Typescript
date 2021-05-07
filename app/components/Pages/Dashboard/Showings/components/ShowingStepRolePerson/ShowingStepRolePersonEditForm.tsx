import { Box, Button, Typography } from '@material-ui/core'
import { upperFirst, kebabCase } from 'lodash'

import { Form } from 'react-final-form'

import { FormTextField, FormPhoneField } from 'components/final-form-fields'

import { requiredTextValidator } from './helpers'

interface ShowingStepRolePersonEditFormProps {
  personTitle: string
  initialData: IShowingRoleInputPerson
  onSubmit: (data: IShowingRoleInputPerson) => void
  submitLabel?: string
  submitDisabled?: boolean
  onCancel?: () => void
}

function ShowingStepRolePersonEditForm({
  personTitle,
  initialData,
  onSubmit,
  submitLabel = 'Next',
  submitDisabled = false,
  onCancel
}: ShowingStepRolePersonEditFormProps) {
  const handleSubmit = (data: IShowingRoleInputPerson) => {
    onSubmit({
      ...data,
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      phone_number: data.phone_number.trim(),
      email: data.email.trim()
    })
  }

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialData}
      render={({ handleSubmit, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <Typography variant="h6">
                Listing {upperFirst(kebabCase(personTitle))} Info
              </Typography>
            </Box>

            <FormTextField
              label="First Name"
              name="first_name"
              required
              autoFocus
              validate={requiredTextValidator}
            />
            <FormTextField
              label="Last Name"
              name="last_name"
              required
              validate={requiredTextValidator}
            />
            <FormTextField
              label="Email"
              name="email"
              required
              validate={requiredTextValidator}
            />
            <FormPhoneField
              label="Phone"
              name="phone_number"
              required
              format={false}
              validate={requiredTextValidator}
            />

            <Box mt={4} display="flex" justifyContent="flex-end">
              <Box mr={1}>
                <Button
                  type="button"
                  disabled={submitting || submitDisabled}
                  variant="outlined"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Box>
              <Button
                type="submit"
                disabled={submitting || submitDisabled}
                color="primary"
                variant="contained"
              >
                {submitLabel}
              </Button>
            </Box>
          </form>
        )
      }}
    />
  )
}

export default ShowingStepRolePersonEditForm
