import React from 'react'
import { Box, Button, Typography } from '@material-ui/core'
import { upperFirst, kebabCase } from 'lodash'

import { Form } from 'react-final-form'

import { FormTextField, FormPhoneField } from 'components/final-form-fields'

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
  return (
    <Form
      onSubmit={onSubmit}
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
            />
            <FormTextField label="Last Name" name="last_name" required />
            <FormTextField label="Email" name="email" required />
            <FormPhoneField
              label="Phone"
              name="phone_number"
              required
              format={false}
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
