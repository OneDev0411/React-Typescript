import React from 'react'
import { Link } from 'react-router'
import { Form, Field } from 'react-final-form'
import { Button } from '@material-ui/core'

import SubmitButton from './SubmitButton'
import { Callout } from '../../../../views/components/Callout'
import SimpleField from '../../Dashboard/Account/Profile/components/SimpleField'

import { SubmitMessage } from './types'

interface Props {
  brandColor: string
  isLoading: boolean
  submitMessage: SubmitMessage | null
  onSubmit: (values) => void
  handleBackToLookupForm: () => void
  username: string
}

export default function SignInForm({
  brandColor,
  isLoading,
  submitMessage,
  onSubmit,
  handleBackToLookupForm,
  username
}: Props) {
  const validate = values => {
    let errors: { password?: string } = {}

    if (!values.password) {
      errors.password = 'Required'
    } else if (values.password.length < 6) {
      errors.password = 'Must be at least 6 characters.'
    }

    return errors
  }

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="password"
            type="password"
            label="Password"
            component={SimpleField}
          />
          {submitMessage && (
            <Callout style={{ margin: '1.5rem 0' }} type={submitMessage.type}>
              {submitMessage.text}
            </Callout>
          )}
          <SubmitButton
            isDisabled={isLoading}
            color={brandColor}
            text={isLoading ? 'Signing in...' : 'Sign in'}
          />
          <p style={{ textAlign: 'center' }}>
            <Button
              onClick={handleBackToLookupForm}
              variant="text"
              color="primary"
            >
              Back
            </Button>
          </p>
          <p className="c-auth__subtitle">
            &nbsp;&nbsp;
            <Link to={`/password/forgot?email=${encodeURIComponent(username)}`}>
              Forgot Password?
            </Link>
          </p>
        </form>
      )}
    />
  )
}
