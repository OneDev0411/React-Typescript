import React from 'react'

import { Typography, Box } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'
import { Form, Field } from 'react-final-form'
import { Link } from 'react-router'
import isEmail from 'validator/lib/isEmail'

import { Callout } from '../../../../views/components/Callout'
import SimpleField from '../../Dashboard/Account/Profile/components/SimpleField'

import SubmitButton from './SubmitButton'
import { SubmitMessage } from './types'

interface FormValues {
  username: string
}

interface Props {
  isLoading: boolean
  initialValues?: FormValues
  submitMessage: SubmitMessage | null
  onSubmit: (values: FormValues) => void
}

export default function LookUpForm({
  isLoading,
  initialValues = { username: '' },
  submitMessage,
  onSubmit
}: Props) {
  const theme = useTheme<Theme>()

  const validate = (values: FormValues) => {
    const errors: { username?: string } = {}

    if (!values.username) {
      errors.username = 'Required'
    } else if (!isEmail(values.username)) {
      errors.username = 'Invalid email address'
    }

    return errors
  }

  return (
    <Form
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, form }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="username"
            type="email"
            label="Email"
            tabIndex={0}
            component={SimpleField}
          />
          {submitMessage && (
            <Box mt={1.5} mb={2}>
              <Callout
                style={{ margin: theme.spacing(0, 0, 1, 0) }}
                type={submitMessage.type}
              >
                {submitMessage.text}
              </Callout>
              <Typography>
                <Link
                  style={{ color: theme.palette.secondary.main }}
                  to={`/signup?email=${window.encodeURIComponent(
                    form.getState().values.username
                  )}`}
                >
                  Do you want to sign up?
                </Link>
              </Typography>
            </Box>
          )}
          <SubmitButton
            isDisabled={isLoading}
            color={theme.palette.primary.main}
            text={isLoading ? 'Looking up...' : 'Next'}
          />

          <p className="c-auth__subtitle">
            <small>Don't have an account?</small>
            &nbsp;&nbsp;
            <Link to="/signup">Sign up</Link>
          </p>
        </form>
      )}
    />
  )
}
