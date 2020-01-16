import React from 'react'
import { Form, Field } from 'react-final-form'

import SubmitButton from './SubmitButton'
import Button from '../../../../views/components/Button/ActionButton'
import SimpleField from '../../Dashboard/Account/Profile/components/SimpleField'

interface Props {
  brandColor: string
  isLoading: boolean
  error: string
  onSubmit: (values) => void
  handleBackToLookupForm: () => void
}

export default function SigninForm(props: Props) {
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
      onSubmit={props.onSubmit}
      validate={validate}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="password"
            type="password"
            label="Password"
            component={SimpleField}
          />

          {props.error && (
            <div
              className="c-auth__submit-error-alert"
              style={{ display: 'flex' }}
            >
              <span>
                The password is incorrect. Try it again with another password or{' '}
              </span>
              <Button
                type="button"
                appearance="link"
                onClick={props.handleBackToLookupForm}
              >
                account
              </Button>
            </div>
          )}
          <SubmitButton
            isDisabled={props.isLoading}
            color={props.brandColor}
            text={props.isLoading ? 'Signing in...' : 'Sign in'}
          />
        </form>
      )}
    />
  )
}
